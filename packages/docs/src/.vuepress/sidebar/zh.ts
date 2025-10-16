import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    "",
    "installation",
    {
      text: '导引',
      icon: 'swatchbook',
      children: [
        "guide/create-a-mod"
      ]
    },
    {
      text: '参考',
      icon: 'book',
      children: [
        "reference/meta.json",
        "reference/life-cycle",
        "reference/hot-patching"
      ]
    }
  ],
});
