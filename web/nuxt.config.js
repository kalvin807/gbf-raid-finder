import i18n from './configs/i18n'

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
          'Another Granblue Fantasy Raid finder 最新のグラブルTwitter救援検索ツール',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'gbf, グラブル, granblue, granblue fantasy, gbf raiders, raid finder, gbf tweetdeck',
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
  plugins: [
    {
      src: './plugins/googleTag.js',
      mode: 'client',
    },
  ],
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
  modules: ['@nuxtjs/axios', 'nuxt-i18n'],
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
    extractCSS: process.env.NODE_ENV === 'production',
  },
  i18n: {
    locales: [
      { code: 'ja', iso: 'ja-JP', name: '日本語' },
      { code: 'en', iso: 'en-US', name: 'English' },
    ],
    defaultLocale: 'ja',
    vueI18n: i18n,
    vueI18nLoader: process.env.NODE_ENV === 'production',
    strategy: 'no_prefix',
    seo: false,
    detectBrowserLanguage: {
      useCookie: true,
    },
    baseUrl: 'https://gbf.kalvin.io/',
  },
}
