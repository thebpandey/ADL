import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const organizationName = "thebpandey";
const projectName = "ADL";

const config: Config = {
  title: "Android Desktop Linux",
  tagline: "Documentation for Android Desktop Linux",
  favicon: "img/favicon.ico",

  url: `https://${organizationName}.github.io`,
  baseUrl: `/${projectName}/`,

  organizationName,
  projectName,
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
  ],

  themeConfig: {
    metadata: [
      {
        name: "description",
        content: "Documentation for Android Desktop Linux (ADL)",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Android Desktop Linux Documentation",
      },
      {
        property: "og:description",
        content: "Documentation for Android Desktop Linux (ADL)",
      },
      {
        property: "og:site_name",
        content: "Android Desktop Linux",
      },
      { name: "twitter:card", content: "summary" },
    ],

    navbar: {
      title: "Android Desktop Linux",
      logo: {
        alt: "ADL Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: `https://github.com/${organizationName}/${projectName}`,
          label: "GitHub",
          position: "right",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Getting Started",
              to: "/docs/intro",
            },
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
          title: "More",
          items: [
            {
              label: "GitHub",
              href: `https://github.com/${organizationName}/${projectName}`,
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
