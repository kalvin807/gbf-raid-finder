<template>
  <section>
    <div class="column feed-column" :class="clicked && 'clicked'" @click="copy(msg)">
      <div class="has-text-left columns is-mobile">
        <div class="column is-narrow">
          <img class="img-rounded" :src="imgUrl" />
        </div>

        <div class="column">
          <div class="level">
            <div class="column">
              <div class="columns text-columns">
                <div class="text-column is-size-7-mobile is-size-6">
                  <b>{{ msg.jp }}</b>
                </div>
                <div class="text-column is-size-7-mobile is-size-6">
                  <b>{{ msg.en }}</b>
                </div>
              </div>
            </div>
          </div>
          <div class="is-size-7-mobile is-size-6 level text-column">{{ msg.msg }}</div>
        </div>
        <div
          class="is-size-7-mobile is-size-6 has-text-right column is-narrow center-text"
        >{{ durationStr }}</div>
        <div
          :room-id="msg.roomId"
          class="is-size-5-mobile is-size-4 has-text-right column is-narrow center-text"
        >{{ msg.roomId }}</div>
      </div>
    </div>
    <hr :class="clicked && 'clicked'" style="margin: 0" />
  </section>
</template>

<script>
import moment from "moment";
import { makeImgUrls } from '../api';
export default {
  name: "raid-msg-card",
  props: {
    msg: Object,
    timeNow: Object,
  },
  data() {
    return {
      clicked: false,
      durationStr: "",
      timestamp: moment(this.msg.timestamp),
      imgUrl: makeImgUrls(msg.img)
    };
  },
  methods: {
    copy(event) {
      const roomId = event.roomId;
      navigator.clipboard.writeText(roomId);
      this.clicked = true;
    },
  },
  watch: {
    timeNow: function () {
      const diff = this.timeNow.diff(this.timestamp, "s");
      if (diff > 60) {
        this.durationStr = `${(diff / 60) >> 0}m`;
      } else this.durationStr = `${diff}s`;
    },
  },
};
</script>

<style>
.feed-column {
  padding: 0.75rem;
}
.clicked {
  background-color: rgba(10, 10, 10, 0.3);
}
.img-rounded {
  max-width: 100px;
  height: auto;
  border-radius: 6px;
  margin: auto;
}
.text-column {
  padding: 0 0.25rem !important;
}
.duration-column {
  margin-top: -0.75rem;
}
.center-text {
  margin: auto;
}
</style>
