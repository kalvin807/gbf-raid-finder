<template>
  <section>
    <div class="column feed-column" :class="clicked && 'clicked'" @click="copy(msg)">
      <div class="has-text-left columns">
        <div class="is-size-6-mobile is-size-6 column is-narrow">
          <b>
            {{ msg.jp }}
            {{ msg.en }}
          </b>
        </div>
        <div class="column columns is-mobile">
          <div class="is-size-7-mobile is-size-6 column">{{ msg.msg }}</div>
          <div
            :room-id="msg.roomId"
            class="is-size-5-mobile is-size-4 has-text-right column is-one-third"
          >{{ msg.roomId }}</div>
        </div>
      </div>
    </div>
    <hr :class="clicked && 'clicked'" style="margin: 0" />
  </section>
</template>

<script>
export default {
  name: "raid-msg-card",
  props: {
    msg: Object,
  },
  data() {
    return {
      clicked: false,
    };
  },
  methods: {
    copy(event) {
      const roomId = event.roomId;
      navigator.clipboard.writeText(roomId);
      this.clicked = true;
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
</style>
