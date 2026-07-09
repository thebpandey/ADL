import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const organizationName = "thebpandey";
const projectName = "ADL";

const config: Config = {
  title: "Android Desktop Linux",
  tagline:
    "Run desktop Linux environments on Android phones and tablets — no root required",
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
          "Run desktop Linux environments on Android phones and tablets. No root required. Complete documentation for Android Desktop Linux (ADL).",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Android Desktop Linux — Full Linux Desktop on Android",
      },
      {
        property: "og:description",
        content:
          "Run desktop Linux environments on Android phones and tablets. No root required. Works with Samsung DeX.",
      },
      { property: "og:site_name", content: "Android Desktop Linux" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Android Desktop Linux Documentation",
      },
      {
        name: "twitter:description",
        content:
          "Run desktop Linux environments on Android phones and tablets. No root required.",
      },
      {
        name: "keywords",
        content:
          "android, linux, desktop, termux, samsung dex, proot, xfce, documentation",
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
            { label: "Quick Start", to: "/docs/quick-start/overview" },
            { label: "Learn", to: "/docs/category/learn" },
            { label: "Reference", to: "/docs/category/reference" },
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
            {
              label: "GitHub",
              href: `https://github.com/${organizationName}/${projectName}`,
            },
            {
              label: "License",
              href: `https://github.com/${organizationName}/${projectName}/blob/main/LICENSE`,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Android Desktop Linux. Built with Docusaurus.`,
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
