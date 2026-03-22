export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  css: ['./app/assets/css/main.css'],
  compatibilityDate: '2026-03-22',
  nitro: {
    output: {
      publicDir: '.output/public'
    }
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Mono:wght@300;400&display=swap'
        }
      ]
    }
  },
  ssr: false,
})