<template>
  <transition-group name="raids-feed" class="raids-feed" tag="div">
    <RaidMsgCard
      v-for="msg in reverseFeed"
      :key="msg.key"
      :msg="msg"
      :time-now="timeNow"
    />
  </transition-group>
</template>

<script>
import dayjs from 'dayjs'
import RaidMsgCard from '../components/RaidMsgCard'
export default {
  components: {
    RaidMsgCard,
  },
  data() {
    return {
      ws: null,
      timeNow: '',
    }
  },
  computed: {
    reverseFeed() {
      return this.$store.state.msgFeed.slice().reverse()
    },
    selected() {
      return this.$store.state.selected
    },
    raids() {
      return this.$store.state.raids
    },
  },
  watch: {
    selected(value) {
      this.updateFilter(value)
    },
  },
  created() {
    this.getRaids()
    this.getCategory()
    this.interval = setInterval(this.time, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  destroyed() {
    if (this.ws) {
      this.ws.close()
    }
  },
  mounted() {
    this.initWebSocket()
    this.checkWebpSupport()
  },
  methods: {
    getCategory() {
      this.$axios.$get('/category').then((res) => {
        const category = Object.entries(res).map(([key, value]) => ({
          en: key,
          ja: value,
        }))
        this.$store.commit('setCategory', category)
      })
    },
    getRaids() {
      this.$axios.$get('/raid').then((res) => {
        const raids = res.map((v, idx) => ({
          ...v,
          index: idx,
        }))
        this.$store.commit('setRaids', raids)
      })
    },
    updateFilter(selected) {
      const req = {
        raid: [...selected],
      }
      if (this.ws.readyState === 1) {
        this.wsSend(JSON.stringify(req))
      }
    },
    initWebSocket() {
      this.ws = new WebSocket(this.$config.websocketUrl)
      this.ws.onmessage = this.onMessage
      this.ws.onopen = this.onOpen
      this.ws.onerror = this.onError
      this.ws.onclose = this.onClose
    },
    onMessage(event) {
      this.$store.commit('insertFeed', event)
    },
    onOpen() {
      console.log('websocket connected')
    },
    onError(err) {
      console.log('websocket err', err)
    },
    onClose() {
      console.log('websocket disconnected')
    },
    wsSend(data) {
      this.ws.send(data)
    },
    time() {
      this.timeNow = dayjs()
    },
    async checkWebpSupport() {
      if (!self.createImageBitmap) {
        this.$store.commit('setWebpSupport', false)
        return
      }
      // Base64 representation of a white point image
      const webpData =
        'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA='
      const blob = await fetch(webpData).then((r) => r.blob())
      const webpSupported = await createImageBitmap(blob).then(
        () => true,
        () => false
      )
      this.$store.commit('setWebpSupport', webpSupported)
    },
  },
}
</script>

<style>
.raids-feed {
  height: 100%;
  margin-top: 60px;
}
.raids-feed-enter-active,
.raids-feed-leave-active {
  opacity: 1;
  transition: opacity 0.5s ease-out;
}
.raids-feed-enter,
.raids-feed-leave-to {
  opacity: 0;
}
</style>
