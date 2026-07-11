import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const organizationName = "thebpandey";
const projectName = "ADL";

const config: Config = {
  title: "Android Desktop Linux",
  tagline: "The Open Knowledge Base for Desktop Linux on Android",
  favicon: "img/favicon.ico",

  url: `https://${organizationName}.github.io`,
  baseUrl: `/${projectName}/`,

  organizationName,
  projectName,
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  themes: ["@docusaurus/theme-mermaid"],

  plugins: [
    "docusaurus-plugin-image-zoom",
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: "/docs",
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: true,
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: `https://github.com/${organizationName}/${projectName}/edit/main/`,
          showLastUpdateTime: true,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          lastmod: "date",
          changefreq: "weekly",
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "robots",
        content: "index, follow",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    },
  ],

  themeConfig: {
    metadata: [
      {
        name: "description",
        content:
          "Android Desktop Linux is the open-source knowledge base for desktop Linux on Android, with installation guides, hardware compatibility, troubleshooting, technical reference material, and community-tested configurations.",
      },
      { name: "author", content: "Bhaskar Pandey" },
      {
        name: "publisher",
        content: "Android Desktop Linux Project - Almora Technology",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content:
          "Android Desktop Linux — The Open Knowledge Base for Desktop Linux on Android",
      },
      {
        property: "og:description",
        content:
          "The open-source knowledge base for running desktop Linux on Android: installation guides, hardware compatibility, troubleshooting, and community-tested configurations.",
      },
      { property: "og:site_name", content: "Android Desktop Linux" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content:
          "Android Desktop Linux — The Open Knowledge Base for Desktop Linux on Android",
      },
      {
        name: "twitter:description",
        content:
          "The open-source knowledge base for running desktop Linux on Android: installation guides, hardware compatibility, troubleshooting, and community-tested configurations.",
      },
      {
        name: "keywords",
        content:
          "android desktop linux, desktop linux on android, knowledge base, documentation, termux, proot, samsung dex, ubuntu, debian, arch linux, xfce, hardware compatibility, mobile computing",
      },
    ],

    navbar: {
      title: "Android Desktop Linux",
      logo: {
        alt: "ADL Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "/get-started",
          position: "left",
          label: "Get Started",
        },
        {
          type: "doc",
          docId: "quick-start/overview",
          position: "left",
          label: "Quick Start",
        },
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        {
          to: "/docs/compatibility/overview",
          position: "left",
          label: "Compatibility",
        },
        {
          to: "/docs/about",
          position: "right",
          label: "About",
        },
        {
          to: "/docs/support-adl",
          position: "right",
          label: "💖 Support",
          "aria-label": "Support ADL (optional donations)",
        },
        {
          href: `https://github.com/${organizationName}/${projectName}`,
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Get Started",
          items: [
            { label: "Guided installer", to: "/get-started" },
            { label: "Quick Start", to: "/docs/quick-start/overview" },
            { label: "Learn", to: "/docs/category/learn" },
            { label: "Reference", to: "/docs/category/reference" },
            { label: "Compatibility", to: "/docs/compatibility/overview" },
            { label: "Downloads", to: "/docs/category/downloads" },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub Discussions",
              href: `https://github.com/${organizationName}/${projectName}/discussions`,
            },
            {
              label: "Issues",
              href: `https://github.com/${organizationName}/${projectName}/issues`,
            },
          ],
        },
        {
          title: "Project",
          items: [
            { label: "About", to: "/docs/about" },
            { label: "Support ADL", to: "/docs/support-adl" },
            {
              label: "GitHub",
              href: `https://github.com/${organizationName}/${projectName}`,
            },
            {
              label: "License",
              href: `https://github.com/${organizationName}/${projectName}/blob/main/LICENSE`,
            },
            {
              label: "Contributing",
              href: `https://github.com/${organizationName}/${projectName}/blob/main/CONTRIBUTING.md`,
            },
            {
              label: "Security",
              href: `https://github.com/${organizationName}/${projectName}/blob/main/SECURITY.md`,
            },
          ],
        },
        {
          title: "Author",
          items: [
            {
              label: "GitHub — @thebpandey",
              href: "https://github.com/thebpandey",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/pandeybhaskar",
            },
            {
              label: "bhaskarpandey.com",
              href: "https://www.bhaskarpandey.com",
            },
            {
              label: "Almora Technology",
              href: "https://almora.tech",
            },
          ],
        },
      ],
      copyright: `Android Desktop Linux is the open knowledge base for desktop Linux on Android.<br />Created by Bhaskar Pandey · Android Desktop Linux Project - Almora Technology<br />Copyright © 2026 Bhaskar Pandey. Released under the MIT License. Built with Docusaurus.<br />Android Desktop Linux is an independent project, not affiliated with or endorsed by Google or Samsung.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "json",
        "yaml",
        "toml",
        "ini",
        "diff",
        "docker",
        "makefile",
        "python",
        "java",
        "properties",
      ],
    },

    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },

    zoom: {
      selector: ".markdown img",
      background: {
        light: "rgb(255, 255, 255)",
        dark: "rgb(50, 50, 50)",
      },
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
