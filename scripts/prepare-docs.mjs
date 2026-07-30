import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptsDir, '..');
const publicDir = resolve(repoRoot, 'public');
const docsDir = resolve(repoRoot, 'src/content/docs');

const SITE = 'https://myndlabs.tech';
const PRODUCT = 'varsha';

await preparePublicAssets();
await cleanStaleDirs();
await generateAgentContext();

async function cleanStaleDirs() {
  const previewDir = resolve(docsDir, 'preview');
  await rm(previewDir, { recursive: true, force: true });
}

async function preparePublicAssets() {
  await rm(publicDir, { recursive: true, force: true });
  await mkdir(publicDir, { recursive: true });

  for (const file of [
    'install.sh',
    'install.ps1',
    'agent-guide.md',
    'latest.json',
    'preview.json',
    'robots.txt',
  ]) {
    const source = resolve(repoRoot, file);
    try {
      await cp(source, resolve(publicDir, file));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  for (const directory of ['assets', 'css']) {
    try {
      await cp(resolve(repoRoot, directory), resolve(publicDir, directory), {
        recursive: true,
      });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

// Generate machine-readable context bundles for LLM coding agents and crawlers.
// llms.txt   -> short index (~40k token budget): titles, links, summaries.
// llms-full.txt -> long bundle (~320k token budget): full doc bodies.
// Token budgets are approximated at ~4 characters per token.
async function generateAgentContext() {
  const CHARS_PER_TOKEN = 4;
  const SHORT_BUDGET = 40_000 * CHARS_PER_TOKEN;
  const LONG_BUDGET = 320_000 * CHARS_PER_TOKEN;

  const docs = await collectDocs(docsDir);
  const enDocs = docs
    .filter((doc) => !doc.slug.startsWith('ja/') && !doc.slug.startsWith('zh-cn/'))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const header = [
    `# ${PRODUCT}`,
    '',
    `> Documentation bundle for LLM coding agents. Canonical docs: ${SITE}/docs/`,
    '',
  ].join('\n');

  const shortBody = enDocs
    .map((doc) => {
      const url = `${SITE}/docs/${doc.slug === 'index' ? '' : `${doc.slug}/`}`;
      return `- [${doc.title}](${url}): ${doc.summary}`;
    })
    .join('\n');
  const shortText = clamp(`${header}## Docs\n\n${shortBody}\n`, SHORT_BUDGET);
  await writeFile(resolve(publicDir, 'llms.txt'), shortText, 'utf8');

  const longBody = enDocs
    .map((doc) => `## ${doc.title}\n\nSource: ${SITE}/docs/${doc.slug === 'index' ? '' : `${doc.slug}/`}\n\n${doc.body}`)
    .join('\n\n---\n\n');
  const longText = clamp(`${header}${longBody}\n`, LONG_BUDGET);
  await writeFile(resolve(publicDir, 'llms-full.txt'), longText, 'utf8');

  const skill = await readFile(resolve(repoRoot, 'SKILL.md'), 'utf8').catch(() => null);
  if (skill) await writeFile(resolve(publicDir, 'SKILL.md'), skill, 'utf8');
}

async function collectDocs(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await collectDocs(full, base)));
      continue;
    }
    if (!/\.(md|mdx)$/i.test(entry.name)) continue;
    const raw = await readFile(full, 'utf8');
    const slug = relative(base, full).replace(/\\/g, '/').replace(/\.(md|mdx)$/i, '').replace(/\/index$/, '');
    const { title, description, body } = parseFrontmatter(raw);
    out.push({
      slug: slug === '' ? 'index' : slug,
      title: title || slug,
      summary: description || firstParagraph(body),
      body: stripMdx(body),
    });
  }
  return out;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { title: '', description: '', body: raw };
  const fm = match[1];
  const title = (fm.match(/^title:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '') || '';
  const description = (fm.match(/^description:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '') || '';
  return { title, description, body: raw.slice(match[0].length) };
}

function stripMdx(body) {
  return body
    .replace(/^\s*import .+?;\s*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function firstParagraph(body) {
  const text = stripMdx(body).split(/\n\n/).find((p) => p.trim().length) || '';
  return text.replace(/\s+/g, ' ').trim();
}

function clamp(text, budget) {
  if (text.length <= budget) return text;
  return `${text.slice(0, budget)}\n\n[Truncated to fit the context budget.]\n`;
}
