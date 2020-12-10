module.exports = {
  base: "/i-show-you/",
  title: "I Show You",
  description: "The documentation of i-show-you",
  port: "3030",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      // { text: "Config", link: "/config/" },
      { text: "FAQ", link: "/faq/" },
      { text: "API", link: "/api/" },
      { text: "GitHub", link: "https://github.com/Lifeni/i-show-you" },
    ],
  },
};
