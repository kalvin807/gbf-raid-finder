<template>
  <section v-if="reverseFeed.length > 0" class="raids-feed">
    <v-banner dark>
      <v-chip
        v-for="raid in selectedRaids"
        :key="raid.index"
        class="ma-1 blue-grey darken-1"
        close
        @click:close="selectRaid(raid)"
      >
        {{ $i18n.locale == 'en' ? raid.en : raid.jp }}
      </v-chip>
    </v-banner>
    <transition-group name="raids-feed" tag="div">
      <RaidMsgCard
        v-for="msg in reverseFeed"
        :key="msg.key"
        :msg="msg"
        :time-now="timeNow"
      />
    </transition-group>
  </section>
  <v-banner v-else class="notice-card" two-line dark>
    <v-avatar slot="icon" color="teal lighten-2" size="40">
      <v-icon icon="mdi-information" color="white"> mdi-information </v-icon>
    </v-avatar>
    {{ $t('motd') }}
    <template v-slot:actions>
      <v-btn
        ref="noopener noreferrer"
        href="https://forms.gle/KQ826MqKRCHRmANc9"
        target="_blank"
        color="teal lighten-2"
        text
        >{{ $t('supportBtn') }}</v-btn
      >
    </template>
  </v-banner>
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
      return this.$store.state.msgFeed
        .slice(Math.max(this.$store.state.msgFeed.length - 30, 0))
        .reverse()
    },
    selected() {
      return this.$store.state.selected
    },
    selectedRaids() {
      return this.raids.filter((v) =>
        this.$store.state.selected.includes(v.index)
      )
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
    selectRaid(event) {
      this.$store.commit('toggleSelected', event.index)
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
.notice-card {
  margin-top: 50px;
}
.raids-feed {
  margin-top: 50px;
}
.raids-feed-enter-active,
.raids-feed-leave-active {
  opacity: 1;
  transition: all 0.3s ease;
}
.raids-feed-enter,
.raids-feed-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
