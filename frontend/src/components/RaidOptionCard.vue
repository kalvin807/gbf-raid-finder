<template>
  <li class="has-text-left" @click="selectMe">
    <div v-bind:class="{selected: raid.selected}" class="raid-card">
      <span class="is-size-6-mobile is-size-5">{{ raid.jp }}</span>
      <br />
      <span class="is-size-7-mobile is-size-6">{{ raid.en }}</span>
    </div>
    <hr style="margin: 0" />
  </li>
</template>

<script>
export default {
  name: "raid-card",
  props: {
    raid: {
      type: Object,
      required: true,
    },
  },
  methods: {
    selectMe() {
      this.$emit("click", this.fn);
    },
  },
};
</script>

<style>
.raid-card {
  padding: 2em;
}
.selected {
  background-color: aquamarine;
}

@media (min-height: 500px) {
  .raid-card {
    padding: 1em;
  }
}

@media (min-height: 1024px) {
  .raid-card {
    padding: 1em 1.5em;
  }
}
</style>
