// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;600;700&family=Stack+Sans+Headline:wght@500;600;700&display=swap'
        }
      ]
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  nitro: {
    storage: {
      blogs: { driver: 'fs', base: './data/blogs' }
    }
  }
})
