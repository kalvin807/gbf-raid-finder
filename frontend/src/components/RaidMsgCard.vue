<template>
  <div class="has-text-left columns">
    <div class="is-size-6-mobile is-size-5 column is-narrow">
      <b>
        {{ msg.jp }}
        {{ msg.en }}
      </b>
    </div>
    <div class="columns is-mobile is-vcentered">
      <div class="is-size-6-mobile is-size-5 column">{{ msg.msg }}</div>
      <div class="is-size-5-mobile is-size-4 has-text-right column is-one-third">{{ msg.roomId }}</div>
    </div>
    <hr style="margin: 0" />
  </div>
</template>

<script>
export default {
  name: "raid-msg-card",
  props: {
    msg: Object,
  },
};
</script>

<style>
.is-mobile {
  padding: 0.75rem;
}
</style>
