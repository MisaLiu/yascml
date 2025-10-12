import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "YASCML",
      description: "Yet Another SugarCube Mod Loader",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "YASCML",
      description: "另一个 SugarCube 模组加载器",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
