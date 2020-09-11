<template>
  <section>
    <section v-if="selected.length > 0" class="raids-feed">
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
          v-for="msg in feed"
          :key="msg.key"
          :msg="msg"
          :time-now="timeNow"
          :webp-support="webpSupport"
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

    <v-snackbar
      v-model="snackbar"
      :color="sbType"
      :timeout="sbTimeOut"
      transition="slide-y-reverse-transition"
    >
      {{ sbMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="sbClose()">
          {{ sbType == 'success' ? $t('okBtn') : $t('reconnectBtn') }}
        </v-btn>
      </template>
    </v-snackbar>
  </section>
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
      timeNow: dayjs(),
      snackbar: false,
      sbMessage: '',
      sbType: '',
      sbTimeOut: -1,
    }
  },
  computed: {
    feed() {
      return this.$store.state.msgFeed
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
    webpSupport() {
      return this.$store.state.webpSupport
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
    this.initSelectedRaid()
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
      this.updateFilter(this.selected)
      this.connectedToast()
    },
    onError(err) {
      console.log('websocket err', err)
    },
    onClose(event) {
      console.log('websocket disconnected')
      this.disconnectedToast()
    },
    wsSend(data) {
      this.ws.send(data)
    },
    time() {
      this.timeNow = dayjs()
    },
    initSelectedRaid() {
      this.$store.commit('initSelected')
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
    connectedToast() {
      this.sbMessage = this.$t('connected')
      this.sbType = 'success'
      this.sbTimeOut = 4000
      this.snackbar = true
    },
    disconnectedToast() {
      this.sbMessage = this.$t('disconnected')
      this.sbType = 'error'
      this.sbTimeOut = -1
      this.snackbar = true
    },
    sbClose() {
      this.snackbar = false
      if (this.sbType !== 'success') this.initWebSocket()
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
