#!/usr/bin/env node

/**
 * create-varsha — Scaffold a new varsha website project.
 *
 * A premium Astro + Starlight starter template by myndlabs.
 * Zero-dependency CLI using only Node.js built-in modules.
 *
 * Usage:
 *   npx create-varsha [project-name] [options]
 *   npm create varsha [project-name]
 *   yarn create varsha [project-name]
 *   pnpm create varsha [project-name]
 *   bunx create-varsha [project-name]
 *
 * Options:
 *   --template <branch>   Git branch/tag to use (default: main)
 *   --pm <manager>        Package manager: npm, yarn, pnpm, bun (default: npm)
 *   --no-install          Skip dependency installation
 *   --no-git              Skip git initialization
 *   --help, -h            Show help
 *   --version, -v         Show version
 *
 * @author Yethikrishna R <hey@myndlabs.tech>
 * @license MIT
 */

import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, renameSync, readFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';

// --- Constants ---

const REPO_URL = 'https://github.com/yethikrishna/web-ui-template';
const REPO_ARCHIVE = `${REPO_URL}/archive/refs/heads`;
const VERSION = '1.0.0';

// Terminal colors (disabled on non-TTY)
const isTTY = process.stdout.isTTY;
const c = {
  reset: isTTY ? '\x1b[0m' : '',
  bold: isTTY ? '\x1b[1m' : '',
  dim: isTTY ? '\x1b[2m' : '',
  red: isTTY ? '\x1b[31m' : '',
  green: isTTY ? '\x1b[32m' : '',
  yellow: isTTY ? '\x1b[33m' : '',
  blue: isTTY ? '\x1b[34m' : '',
  magenta: isTTY ? '\x1b[35m' : '',
  cyan: isTTY ? '\x1b[36m' : '',
};

// --- Utilities ---

/** Print a branded banner. */
function banner() {
  console.log();
  console.log(`${c.bold}${c.cyan}  varsha${c.reset} ${c.dim}— premium Astro starter by myndlabs${c.reset}`);
  console.log();
}

/** Print an info message. */
function info(msg) {
  console.log(`${c.blue}  ℹ${c.reset}  ${msg}`);
}

/** Print a success message. */
function success(msg) {
  console.log(`${c.green}  ✓${c.reset}  ${msg}`);
}

/** Print a warning message. */
function warn(msg) {
  console.log(`${c.yellow}  ⚠${c.reset}  ${msg}`);
}

/** Print an error message. */
function error(msg) {
  console.error(`${c.red}  ✗${c.reset}  ${msg}`);
}

/** Check if a command exists on the system. */
function hasCommand(cmd) {
  try {
    execSync(`which ${cmd} 2>/dev/null || where ${cmd} 2>nul`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/** Run a command and stream output. Returns a promise. */
function run(cmd, args, cwd) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('close', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`Command failed: ${cmd} ${args.join(' ')} (exit code ${code})`));
    });
    child.on('error', reject);
  });
}

/** Prompt the user for input. */
async function prompt(question, defaultValue) {
  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question(question);
    return answer.trim() || defaultValue || '';
  } finally {
    rl.close();
  }
}

/** Validate a project name. */
function validateProjectName(name) {
  if (!name) return 'Project name is required.';
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    return 'Project name may only contain letters, numbers, dots, hyphens, and underscores.';
  }
  if (name.startsWith('.')) return 'Project name cannot start with a dot.';
  if (name.length > 214) return 'Project name is too long (max 214 characters).';
  return null;
}

// --- Core Logic ---

/** Download the template using git clone. */
async function downloadWithGit(targetDir, branch) {
  const args = branch
    ? ['clone', '--depth', '1', '--branch', branch, REPO_URL, targetDir]
    : ['clone', '--depth', '1', REPO_URL, targetDir];

  info(`Cloning template from GitHub...`);
  await run('git', args);
}

/** Download the template using tarball (fallback when git is not available). */
async function downloadWithTarball(targetDir, branch) {
  const branchName = branch || 'main';
  const url = `${REPO_ARCHIVE}/${branchName}.tar.gz`;
  const tempDir = `${targetDir}-temp-${Date.now()}`;

  info(`Downloading template tarball...`);

  // Use curl or PowerShell to download
  if (hasCommand('curl')) {
    execSync(`curl -L -o "${tempDir}.tar.gz" "${url}"`, { stdio: 'inherit' });
  } else if (process.platform === 'win32') {
    execSync(`powershell -Command "Invoke-WebRequest -Uri '${url}' -OutFile '${tempDir}.tar.gz'"`, { stdio: 'inherit' });
  } else {
    throw new Error('Cannot download: neither curl nor PowerShell is available. Please install git and try again.');
  }

  // Extract
  mkdirSync(tempDir, { recursive: true });
  if (hasCommand('tar')) {
    execSync(`tar -xzf "${tempDir}.tar.gz" -C "${tempDir}"`, { stdio: 'inherit' });
  } else if (process.platform === 'win32') {
    execSync(`powershell -Command "Expand-Archive -Path '${tempDir}.tar.gz' -DestinationPath '${tempDir}'"`, { stdio: 'inherit' });
  } else {
    throw new Error('Cannot extract: tar command not found. Please install git and try again.');
  }

  // Move contents (the archive extracts to a subdirectory like web-ui-template-main)
  const extractedDir = join(tempDir, `web-ui-template-${branchName}`);
  if (existsSync(extractedDir)) {
    renameSync(extractedDir, targetDir);
  } else {
    // Try to find the extracted directory
    const entries = execSync(`ls "${tempDir}"`, { encoding: 'utf-8' }).trim().split('\n');
    if (entries.length > 0) {
      renameSync(join(tempDir, entries[0]), targetDir);
    }
  }

  // Cleanup
  rmSync(tempDir, { recursive: true, force: true });
  try { rmSync(`${tempDir}.tar.gz`, { force: true }); } catch {}
}

/** Remove the .git directory from the cloned project. */
function removeGitHistory(targetDir) {
  const gitDir = join(targetDir, '.git');
  if (existsSync(gitDir)) {
    rmSync(gitDir, { recursive: true, force: true });
  }
}

/** Initialize a fresh git repository. */
async function initGit(targetDir) {
  if (!hasCommand('git')) {
    warn('git not found — skipping git initialization.');
    return;
  }
  info('Initializing git repository...');
  await run('git', ['init'], targetDir);
  await run('git', ['add', '.'], targetDir);
  await run('git', ['commit', '-m', 'Initial commit: scaffolded with create-varsha'], targetDir);
}

/** Install dependencies using the specified package manager. */
async function installDeps(targetDir, pm) {
  const managers = {
    npm: { cmd: 'npm', args: ['install'] },
    yarn: { cmd: 'yarn', args: [] },
    pnpm: { cmd: 'pnpm', args: ['install'] },
    bun: { cmd: 'bun', args: ['install'] },
  };

  const manager = managers[pm] || managers.npm;

  if (!hasCommand(manager.cmd)) {
    warn(`${manager.cmd} not found — falling back to npm.`);
    if (!hasCommand('npm')) {
      warn('npm not found either. Please install Node.js and run "npm install" manually.');
      return;
    }
    manager.cmd = 'npm';
    manager.args = ['install'];
  }

  info(`Installing dependencies with ${manager.cmd}...`);
  await run(manager.cmd, manager.args, targetDir);
}

// --- Help & Version ---

function showHelp() {
  console.log(`
  ${c.bold}create-varsha${c.reset} — Scaffold a new varsha website project.

  ${c.bold}Usage:${c.reset}
    npx create-varsha [project-name] [options]
    npm create varsha [project-name]
    yarn create varsha [project-name]
    pnpm create varsha [project-name]
    bunx create-varsha [project-name]

  ${c.bold}Options:${c.reset}
    --template <branch>   Git branch or tag to use (default: main)
    --pm <manager>        Package manager: npm, yarn, pnpm, bun (default: npm)
    --no-install          Skip dependency installation
    --no-git              Skip git initialization
    -h, --help            Show this help message
    -v, --version         Show version number

  ${c.bold}Examples:${c.reset}
    ${c.dim}# Create a project with defaults${c.reset}
    npx create-varsha my-site

    ${c.dim}# Interactive mode (prompts for project name)${c.reset}
    npx create-varsha

    ${c.dim}# Use pnpm and skip git init${c.reset}
    npx create-varsha my-site --pm pnpm --no-git

    ${c.dim}# Use a specific branch${c.reset}
    npx create-varsha my-site --template v2

  ${c.bold}Documentation:${c.reset}
    https://myndlabs.tech/docs/

  ${c.bold}Repository:${c.reset}
    https://github.com/yethikrishna/web-ui-template
`);
}

function showVersion() {
  console.log(`create-varsha v${VERSION}`);
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);

  // Handle --help and --version
  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }
  if (args.includes('-v') || args.includes('--version')) {
    showVersion();
    process.exit(0);
  }

  banner();

  // Parse arguments
  let projectName = null;
  let template = 'main';
  let pm = 'npm';
  let shouldInstall = true;
  let shouldInitGit = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--template') {
      template = args[++i] || 'main';
    } else if (arg === '--pm') {
      pm = args[++i] || 'npm';
    } else if (arg === '--no-install') {
      shouldInstall = false;
    } else if (arg === '--no-git') {
      shouldInitGit = false;
    } else if (!arg.startsWith('-')) {
      projectName = arg;
    }
  }

  // Validate package manager
  const validPMs = ['npm', 'yarn', 'pnpm', 'bun'];
  if (!validPMs.includes(pm)) {
    warn(`Unknown package manager "${pm}". Using npm.`);
    pm = 'npm';
  }

  // Prompt for project name if not provided
  if (!projectName) {
    projectName = await prompt(
      `${c.cyan}  ?${c.reset} Project name: `,
      'my-varsha-site'
    );
    if (!projectName) {
      projectName = 'my-varsha-site';
    }
  }

  // Validate project name
  const validationError = validateProjectName(projectName);
  if (validationError) {
    error(validationError);
    process.exit(1);
  }

  // Resolve target directory
  const targetDir = resolve(projectName);

  // Check if directory already exists and is not empty
  if (existsSync(targetDir)) {
    const entries = execSync(
      process.platform === 'win32'
        ? `dir /b "${targetDir}" 2>nul`
        : `ls -A "${targetDir}" 2>/dev/null`,
      { encoding: 'utf-8' }
    ).trim();

    if (entries) {
      error(`Directory "${projectName}" already exists and is not empty.`);
      error('Please choose a different name or remove the existing directory.');
      process.exit(1);
    }
  }

  // Create target directory
  mkdirSync(targetDir, { recursive: true });

  // Download template
  try {
    if (hasCommand('git')) {
      await downloadWithGit(targetDir, template !== 'main' ? template : null);
      removeGitHistory(targetDir);
    } else {
      warn('git not found — using tarball download instead.');
      await downloadWithTarball(targetDir, template);
    }
  } catch (err) {
    error(`Failed to download template: ${err.message}`);
    error('Please check your internet connection and try again.');
    rmSync(targetDir, { recursive: true, force: true });
    process.exit(1);
  }

  success(`Project created at ${c.dim}${targetDir}${c.reset}`);

  // Install dependencies
  if (shouldInstall) {
    try {
      await installDeps(targetDir, pm);
      success('Dependencies installed.');
    } catch (err) {
      warn(`Dependency installation failed: ${err.message}`);
      warn('You can install manually by running the install command in the project directory.');
    }
  } else {
    info('Skipping dependency installation (--no-install).');
  }

  // Initialize git
  if (shouldInitGit) {
    try {
      await initGit(targetDir);
      success('Git repository initialized.');
    } catch (err) {
      warn(`Git initialization failed: ${err.message}`);
    }
  } else {
    info('Skipping git initialization (--no-git).');
  }

  // Print next steps
  console.log();
  console.log(`  ${c.green}✓${c.reset} ${c.bold}All set!${c.reset} Your varsha project is ready.`);
  console.log();
  console.log(`  ${c.bold}Next steps:${c.reset}`);
  console.log();
  console.log(`    ${c.cyan}cd${c.reset} ${projectName}`);
  if (!shouldInstall) {
    console.log(`    ${c.cyan}${pm}${c.reset} install`);
  }
  console.log(`    ${c.cyan}${pm}${c.reset} run dev`);
  console.log();
  console.log(`  ${c.dim}Then open http://localhost:4321 in your browser.${c.reset}`);
  console.log();
  console.log(`  ${c.dim}Documentation: https://myndlabs.tech/docs/${c.reset}`);
  console.log(`  ${c.dim}GitHub: https://github.com/yethikrishna/web-ui-template${c.reset}`);
  console.log(`  ${c.dim}Instagram: @yethikrishnar${c.reset}`);
  console.log();
}

main().catch((err) => {
  error(`Unexpected error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
