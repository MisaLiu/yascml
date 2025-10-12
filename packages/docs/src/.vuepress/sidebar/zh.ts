import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    "",
    "installation",
    {
      text: '参考',
      icon: 'book',
      children: [
        "reference/meta.json"
      ]
    }
  ],
});
