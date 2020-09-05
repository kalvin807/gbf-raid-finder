<template>
  <v-col cols="12" class="dense">
    <v-card
      class="base"
      :class="{ selected: isSelected() }"
      dark
      @click="$emit('click')"
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
            height="70"
            max-height="70"
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
  background-color: #37474f !important;
}
.selected {
  background-color: #009688 !important;
}
.dense {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
</style>
