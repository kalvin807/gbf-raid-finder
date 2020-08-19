<template>
  <li class="has-text-left" @click="selectMe">
    <div v-bind:class="{selected: raid.selected}" class="raid-card option">
      <div class="level is-mobile">
        <div class="text-column">
          <div class="is-size-6-mobile is-size-5">{{ raid.jp }}</div>
          <div class="is-size-7-mobile is-size-6">{{ raid.en }}</div>
        </div>
        <div class="level-right">
          <b-image :src="uri" webp-fallback=".jpg"></b-image>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { makeImgUrl } from "../api";
export default {
  name: "raidCard",
  props: {
    raid: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uri: makeImgUrl(this.raid.image),
    };
  },
  methods: {
    selectMe() {
      this.$emit("click", this.fn);
    },
  },
};
</script>

<style scoped>
.raid-card {
  padding: 2em;
}
.raid-card:hover {
  -webkit-transform: translateY(-0.2rem);
  -moz-transform: translateY(-0.2rem);
  transform: translateY(-0.2rem);
  transition: all 80ms ease-out;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
.selected {
  background-color: rgba(0, 150, 136, 1) !important;
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
.option {
  margin: 0.5rem;
  border-radius: 0.3rem;
  background-color: #464c4c;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}
img {
  border-radius: 0.3rem;
}
</style>
