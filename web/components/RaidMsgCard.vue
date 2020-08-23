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
import moment from 'moment'

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
      timestamp: moment(this.msg.timestamp),
      uri: this.makeImgUrl(this.msg.img),
    }
  },
  watch: {
    timeNow() {
      const diff = this.timeNow.diff(this.timestamp, 's')
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
      return `${process.env.githubFolder || ''}${uri}`
    },
  },
}
</script>

<style scoped>
.base {
  background-color: rgba(70, 76, 76, 0.8);
}
.clicked {
  background-color: rgba(70, 76, 76, 0.1);
  color: rgba(255, 255, 255, 0.333) !important;
}
</style>
