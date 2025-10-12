import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    "installation",
    {
      text: 'Reference',
      icon: 'book',
      children: [
        "reference/meta.json"
      ]
    }
  ],
});
