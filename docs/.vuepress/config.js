module.exports = {
  base: "/i-show-you/",
  title: "I Show You",
  description: "The documentation of i-show-you",
  port: "3030",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "主页", link: "/" },
      { text: "指南", link: "/guide/" },
      { text: "配置", link: "/config/" },
      { text: "FAQ", link: "/faq/" },
      { text: "API", link: "/api/" },
      { text: "GitHub", link: "https://github.com/Lifeni/i-show-you" },
    ],
    sidebar: {
      "/guide/": ["", "troubleshooting"],
    },
    displayAllHeaders: true,
  },
};
