import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

const repoBlob = 'https://github.com/yethikrishna/web-ui-template/blob/main/';

function rewriteRepoLinks() {
  const docsLinks = new Map([
    ['README.md', '/docs/'],
    ['./README.md', '/docs/'],
    ['CUSTOMIZATION.md', '/docs/configuration/'],
    ['./CUSTOMIZATION.md', '/docs/configuration/'],
    ['DEPLOYMENT.md', '/docs/persistence-remote/'],
    ['./DEPLOYMENT.md', '/docs/persistence-remote/'],
    ['DESIGN-SYSTEM.md', '/docs/design-system/'],
    ['./DESIGN-SYSTEM.md', '/docs/design-system/'],
  ]);

  return function transform(tree) {
    walk(tree, (node) => {
      if (!node || (node.type !== 'link' && node.type !== 'definition')) return;
      if (typeof node.url !== 'string') return;

      const [path, suffix = ''] = node.url.split(/(?=[#?])/);
      const mapped = docsLinks.get(path);
      if (mapped) {
        node.url = `${mapped}${suffix}`;
        return;
      }

      const sourcePath = path.startsWith('./') ? path.slice(2) : path;
      if (
        sourcePath.startsWith('src/') ||
        sourcePath.startsWith('scripts/') ||
        sourcePath.startsWith('assets/')
      ) {
        node.url = `${repoBlob}${sourcePath}${suffix}`;
      }
    });
  };
}

function walk(node, visitor) {
  visitor(node);
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) walk(child, visitor);
}

export default defineConfig({
  site: 'https://myndlabs.tech',
  output: 'static',
  redirects: {
    '/ja': '/ja/docs/',
    '/zh-cn': '/zh-cn/docs/',
  },
  integrations: [
    sitemap(),
    starlight({
      title: 'varsha',
      description: 'A premium website starter template by myndlabs. Beautiful UI, built-in docs, blog, and design system.',
      favicon: '/assets/favicon.png?v=15',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        ja: { label: '日本語', lang: 'ja' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/yethikrishna/web-ui-template',
        },
        {
          icon: 'instagram',
          label: 'Instagram',
          href: 'https://instagram.com/yethikrishnar',
        },
      ],
      components: {
        Banner: './src/components/Banner.astro',
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        Footer: './src/components/Footer.astro',
      },
      customCss: ['./src/styles/starlight.css'],
      head: [
        {
          tag: 'script',
          content: `(function () {
  try {
    var KEY = 'varsha-docs-lang';
    var path = location.pathname;
    var m = path.match(/^\\/(ja|zh-cn)(?=\\/|$)/);
    var current = m ? m[1] : path.indexOf('/docs') === 0 ? 'en' : null;
    if (!current) return;
    if (!localStorage.getItem(KEY) && current === 'en') {
      var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
      var target = null;
      for (var i = 0; i < langs.length && !target; i++) {
        var l = String(langs[i]).toLowerCase();
        if (l === 'ja' || l.indexOf('ja-') === 0) target = 'ja';
        else if (l === 'zh' || l.indexOf('zh-') === 0) target = 'zh-cn';
        else if (l.indexOf('en') === 0) break;
      }
      if (target) {
        localStorage.setItem(KEY, target);
        location.replace('/' + target + path + location.search + location.hash);
        return;
      }
    }
    localStorage.setItem(KEY, current);
  } catch (e) {}
})();`,
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: 'https://myndlabs.tech/assets/og-card-v8.png' },
        },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: 'varsha — premium website starter by myndlabs',
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: 'https://myndlabs.tech/assets/og-card-v8.png' },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image:alt',
            content: 'varsha — premium website starter by myndlabs',
          },
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/yethikrishna/web-ui-template/edit/main/',
      },
      lastUpdated: true,
      disable404Route: true,
      sidebar: [
        {
          label: 'Start here',
          translations: { ja: 'はじめに', 'zh-CN': '从这里开始' },
          items: [
            { label: 'Overview', translations: { ja: '概要', 'zh-CN': '概览' }, slug: 'docs' },
            { label: 'Getting started', translations: { ja: '始め方', 'zh-CN': '快速开始' }, slug: 'docs/install' },
            { label: 'Quick start', translations: { ja: 'クイックスタート', 'zh-CN': '快速入门' }, slug: 'docs/quick-start' },
            { label: 'Project structure', translations: { ja: 'プロジェクト構造', 'zh-CN': '项目结构' }, slug: 'docs/concepts' },
            { label: 'Themes', translations: { ja: 'テーマ', 'zh-CN': '主题' }, slug: 'docs/keyboard' },
          ],
        },
        {
          label: 'Building your site',
          translations: { ja: 'サイト構築', 'zh-CN': '构建网站' },
          items: [
            { label: 'Pages & layouts', translations: { ja: 'ページとレイアウト', 'zh-CN': '页面与布局' }, slug: 'docs/how-to-work' },
            { label: 'Customization', translations: { ja: 'カスタマイズ', 'zh-CN': '自定义' }, slug: 'docs/configuration' },
            { label: 'Design system', translations: { ja: 'デザインシステム', 'zh-CN': '设计系统' }, slug: 'docs/design-system' },
            { label: 'Content & blog', translations: { ja: 'コンテンツとブログ', 'zh-CN': '内容与博客' }, slug: 'docs/session-state' },
            { label: 'Examples', translations: { ja: '例', 'zh-CN': '示例' }, slug: 'docs/marketplace' },
          ],
        },
        {
          label: 'Going live',
          translations: { ja: '公開', 'zh-CN': '上线部署' },
          items: [
            { label: 'Deployment', translations: { ja: 'デプロイ', 'zh-CN': '部署' }, slug: 'docs/persistence-remote' },
            { label: 'SEO & metadata', translations: { ja: 'SEOとメタデータ', 'zh-CN': 'SEO与元数据' }, slug: 'docs/socket-api' },
          ],
        },
        {
          label: 'Reference',
          translations: { ja: 'リファレンス', 'zh-CN': '参考' },
          items: [
            { label: 'Components', translations: { ja: 'コンポーネント', 'zh-CN': '组件' }, slug: 'docs/plugins' },
            { label: 'CSS tokens', translations: { ja: 'CSSトークン', 'zh-CN': 'CSS 变量' }, slug: 'docs/cli-reference' },
            { label: 'Integrations', translations: { ja: 'インテグレーション', 'zh-CN': '集成' }, slug: 'docs/integrations' },
            { label: 'Showcase', translations: { ja: 'ショーケース', 'zh-CN': '展示' }, slug: 'docs/agents' },
            { label: 'Troubleshooting', translations: { ja: 'トラブルシューティング', 'zh-CN': '故障排除' }, slug: 'docs/troubleshooting' },
            { label: 'Agent skill file', translations: { ja: 'エージェントスキルファイル', 'zh-CN': '智能体技能文件' }, slug: 'docs/agent-skill' },
          ],
        },
        {
          label: 'Resources',
          translations: { ja: 'リソース', 'zh-CN': '资源' },
          items: [
            { label: 'Blog', translations: { ja: 'ブログ', 'zh-CN': '博客' }, link: '/blog/' },
          ],
        },
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [rewriteRepoLinks],
  },
});