<template>
  <v-app id="app" class="is-clipped" data-app="true">
    <NavBar @resetFeed="resetFeed" />

    <transition-group name="raids-feed" class="raids-feed" tag="div">
      <RaidMsgCard
        v-for="msg in reverseFeed"
        :key="msg.key"
        :msg="msg"
        :time-now="timeNow"
      />
    </transition-group>
  </v-app>
</template>

<script>
import dayjs from 'dayjs'
import NavBar from '../components/NavBar'
import RaidMsgCard from '../components/RaidMsgCard'
export default {
  name: 'App',
  components: {
    NavBar,
    RaidMsgCard,
  },
  data() {
    return {
      ws: null,
      msgFeed: [],
      timeNow: '',
    }
  },
  computed: {
    reverseFeed() {
      return this.msgFeed.slice().reverse()
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
    this.ws = new WebSocket(this.$config.websocketUrl)
    this.ws.onmessage = this.onMessage
    this.ws.onopen = this.onOpen
    this.ws.onerror = this.onError
    this.ws.onclose = this.onClose
  },
  methods: {
    getRaids() {
      this.$axios.$get('/raid').then((res) => {
        const raids = res.map((v, idx) => ({
          ...v,
          index: idx,
          selected: false,
          active: true,
        }))
        const raidTypes = [...new Set(raids.map((v) => v.category))].sort(
          function (a, b) {
            if (a < b) return -1
            else if (a > b) return 1
            return 0
          }
        )
        this.$store.commit('setRaids', raids)
        this.$store.commit('setTypes', raidTypes)
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
    onMessage(event) {
      const msg = JSON.parse(event.data)
      const raid = this.raids[msg.raid]
      this.msgFeed.push({
        jp: raid.jp,
        en: raid.en,
        img: raid.image,
        msg: msg.msg,
        roomId: msg.roomId,
        timestamp: msg.timestamp,
        key: `${event.timeStamp}${msg.roomId}`,
      })
    },
    onOpen() {},
    onError() {},
    onClose() {},
    wsSend(data) {
      this.ws.send(data)
    },
    resetFeed() {
      this.msgFeed = []
    },
    time() {
      this.timeNow = dayjs()
    },
  },
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  touch-action: manipulation;
  overflow: hidden;
}
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
