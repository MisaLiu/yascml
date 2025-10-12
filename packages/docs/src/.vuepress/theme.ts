import { hopeTheme } from "vuepress-theme-hope";

import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://yascml.github.io",

  author: {
    name: "Misa Liu",
    url: "https://misaliu.top",
  },

  repo: "yascml/yascml",

  docsDir: "packages/docs/src",

  locales: {
    "/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: `YASCML 2025-${(new Date()).getFullYear()}`,

      displayFooter: true,

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },

    /**
     * Chinese locale config
     */
    "/zh/": {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: `YASCML 2025-${(new Date()).getFullYear()}`,

      displayFooter: true,

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
  },

  copyright: '<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"><img src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" alt="CC BY-NC-SA 4.0 Badge" /></a>&nbsp;<a href="https://www.gnu.org/licenses/agpl-3.0" target="_blank"><img src="https://www.gnu.org/graphics/agplv3-88x31.png" alt="AGPL 3.0 Badge" /></a>',
  license: '<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>&nbsp;|&nbsp;<a href="https://www.gnu.org/licenses/agpl-3.0" target="_blank">AGPL 3.0</a>',
  displayFooter: true,

  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    footnote: true,
    highlighter: true,
    linkify: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
  },

  plugins: {
    components: {
      components: ["Badge", "VPCard"],
    },
    icon: {
      prefix: "fa6-solid:",
    },
  },
});
