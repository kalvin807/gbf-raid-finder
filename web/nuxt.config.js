export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  publicRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL,
    websocketUrl: process.env.WEBSOCKET_URI || 'ws://localhost:8080/ws',
  },
  head: {
    title: 'GBF Raids Finder Omega',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'A New Granblue Fantasy Raids finder with almost realtime search speed',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'gbf, グラブル, gbf raiders, gbf raids finder, granblue fantasy, gbf tweetdeck',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios'],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  axios: {
    baseURL: process.env.BACKEND_URL || 'http://localhost:8080',
  },
  vuetify: {
    /* module options */
    theme: {
      dark: true,
    },
  },
  build: {
    corejs: '3',
    extractCSS: true
  },
  modern: 'client'
}
