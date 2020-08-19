<template>
  <section>
    <div class="column feed-column has-text-white" :class="clicked && 'clicked'" @click="copy(msg)">
      <div class="has-text-left columns is-mobile">
        <div class="column is-narrow">
          <b-image class="img-rounded" :src="imgUrl" webp-fallback=".jpg" :lazy="false" />
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
  </section>
</template>

<script>
import moment from "moment";
import { makeImgUrl } from "../api";
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
      imgUrl: makeImgUrl(this.msg.img),
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

<style scoped>
.feed-column {
  margin: 1rem 1rem;
  border-radius: 0.33rem;
  background: rgba(70, 76, 76, 0.8);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.feed-column:hover {
  -webkit-transform: translateY(-0.2rem);
  -moz-transform: translateY(-0.2rem);
  transform: translateY(-0.2rem);
  transition: transform 80ms ease-in-out;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
.clicked {
  background-color: rgba(70, 76, 76, 0.1);
}
.img-rounded {
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
