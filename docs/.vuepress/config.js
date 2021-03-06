module.exports = {
  base: "/i-show-you/",
  title: "I Show You",
  description: "The documentation of i-show-you",
  port: "3030",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    nav: [
      { text: "主页", link: "/" },
      { text: "指南", link: "/guide/" },
      { text: "配置", link: "/config/" },
      { text: "FAQ", link: "/faq/" },
      { text: "API", link: "/api/" },
      { text: "GitHub", link: "https://github.com/Lifeni/i-show-you" },
    ],
    sidebar: {
      "/guide/": ["", "screenshot", "troubleshooting", "development", "todo"],
    },
    displayAllHeaders: true,
  },
  markdown: {
    extendMarkdown: (md) => {
      md.use(require("markdown-it-task-lists"), { enabled: true });
    },
  },
};
