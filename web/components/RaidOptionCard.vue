<template>
  <v-col cols="12">
    <v-card
      class="base"
      :class="{ selected: isSelected() }"
      dark
      @click="selectMe"
    >
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title class="text-body-2 text-lg-h6">{{
            raid.jp
          }}</v-card-title>
          <v-card-subtitle>{{ raid.en }}</v-card-subtitle>
        </div>
        <div class="ma-3">
          <v-img
            dark
            max-height="100"
            contain
            :src="makeImgUrl(raid.image)"
          ></v-img>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'RaidCard',
  props: {
    raid: {
      type: Object,
      required: true,
    },
  },
  computed: {
    webpSupport() {
      return this.$store.state.webpSupport
    },
    selected() {
      return this.$store.state.selected
    },
  },
  methods: {
    isSelected() {
      return this.selected.includes(this.raid.index)
    },
    selectMe() {
      this.$emit('click', this.fn)
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
  background-color: #424242 !important;
}
.selected {
  background-color: #7045af !important;
}
</style>
