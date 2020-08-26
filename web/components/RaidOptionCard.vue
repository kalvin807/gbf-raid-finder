<template>
  <v-col cols="12">
    <v-card
      class="base"
      :class="{ selected: raid.selected }"
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
          <v-img dark max-height="100" contain :src="uri"></v-img>
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
  data() {
    return {
      uri: this.makeImgUrl(this.raid.image),
    }
  },
  methods: {
    selectMe() {
      this.$emit('click', this.fn)
    },
    makeImgUrl(uri) {
      return `${this.$config.githubPrefix}${uri}`
    },
  },
}
</script>

<style scoped>
.base {
  background-color: #424242;
}
.selected {
  background-color: rgba(0, 150, 136, 1) !important;
}
</style>
