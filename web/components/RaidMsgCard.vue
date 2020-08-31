<template>
  <v-col cols="12" class="raid-feed">
    <v-card class="base" :class="clicked && 'clicked'" dark @click="copy(msg)">
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-row no-gutters align="center">
          <v-col cols="5">
            <v-card-title class="text-body-2 text-lg-h6 raid-feed-text">{{
              msg.jp
            }}</v-card-title>
            <v-card-subtitle class="raid-feed-text"
              >{{ msg.en }}
            </v-card-subtitle>
            <v-card-text class="text-h6">{{ msg.roomId }}</v-card-text>
          </v-col>
          <v-col cols="3">{{ msg.msg }}</v-col>
          <v-spacer></v-spacer>
          <v-col>
            <div class="ma-2" style="height: 90px">
              <v-img
                dark
                height="70"
                contain
                :src="makeImgUrl(msg.image)"
              ></v-img>
              <div class="text-caption text-center duration">
                {{ durationStr }}
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'RaidMsgCard',
  props: {
    msg: {
      type: Object,
      default() {
        return {}
      },
    },
    timeNow: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      clicked: false,
      durationStr: '',
      timeStamp: dayjs(this.msg.timeStamp),
    }
  },
  computed: {
    webpSupport() {
      return this.$store.state.webpSupport
    },
  },
  watch: {
    timeNow() {
      const diff = this.timeNow.diff(this.timeStamp, 's')
      if (diff > 60) {
        this.durationStr = `${(diff / 60) >> 0}m`
      } else this.durationStr = `${diff}s`
    },
  },
  methods: {
    copy(event) {
      const roomId = event.roomId
      navigator.clipboard.writeText(roomId)
      this.clicked = true
    },
    makeImgUrl(uri) {
      if (this.webpSupport) {
        return `${uri}.webp`
      } else {
        return `${uri}.jpg`
      }
    },
  },
}
</script>

<style scoped>
.base {
  background-color: #455a64;
}
.base:hover {
  background-color: #00897b;
}
.base:focus {
  background-color: rgba(84, 110, 122, 0.2);
}
.clicked {
  background-color: rgba(84, 110, 122, 0.2);
  color: rgba(255, 255, 255, 0.333) !important;
}
.raid-feed {
  padding: 6px;
}
.raid-feed-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.duration {
  margin: 0.2rem;
}
</style>
