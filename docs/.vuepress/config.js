module.exports = {
    base: '/i-show-you/',
    title: 'I Show You',
    description: 'The documentation of i-show-you',
    port: '3030',
    head: [
        [ 'link', { rel: 'icon', href: '/favicon.ico' } ]
    ],
    themeConfig: {
        logo: '/logo.png',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
            { text: 'FAQ', link: '/faq/' },
            { text: 'API', link: '/api/' },
            { text: 'Demo', link: 'https://i-show-you.dev.lifeni.life/' },
        ]
    },
}