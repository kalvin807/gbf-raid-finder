<template>
  <v-col cols="12">
    <v-card class="base" :class="clicked && 'clicked'" dark @click="copy(msg)">
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-row no-gutters align="center">
          <v-col cols="5">
            <v-card-title class="text-body-2 text-lg-h6">{{
              msg.jp
            }}</v-card-title>
            <v-card-subtitle>{{ msg.en }} | {{ durationStr }} </v-card-subtitle>
            <v-card-text class="text-h6">{{ msg.roomId }}</v-card-text>
          </v-col>

          <v-col cols="3">{{ msg.msg }}</v-col>
          <v-spacer></v-spacer>
          <v-col>
            <div class="ma-3">
              <v-img dark height="80" contain :src="uri"></v-img>
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
      uri: this.makeImgUrl(this.msg.image),
    }
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
      return `${uri}`
    },
  },
}
</script>

<style scoped>
.base {
  background-color: rgba(97, 97, 97, 0.8);
}
.base:hover {
  background-color: rgba(97, 97, 97, 1);
}
.base:focus {
  background-color: rgba(84, 110, 122, 0.2);
}
.clicked {
  background-color: rgba(84, 110, 122, 0.2);
  color: rgba(255, 255, 255, 0.333) !important;
}
</style>
