import Vue from 'vue'
import VueGtag from 'vue-gtag'

Vue.use(VueGtag, {
  config: { id: process.env.GTAG_ID },
  appName: process.env.GTAG_NAME,
})
