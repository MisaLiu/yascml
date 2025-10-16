import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    "installation",
    {
      text: 'Guide',
      icon: 'swatchbook',
      children: [
        "guide/create-a-mod"
      ]
    },
    {
      text: 'Reference',
      icon: 'book',
      children: [
        "reference/meta.json",
        "reference/life-cycle",
        "reference/hot-patching"
      ]
    }
  ],
});
