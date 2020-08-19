<template>
  <b-navbar fixed-top class="is-dark">
    <template slot="brand">
      <b-navbar-item>
        <h1 class="title is-size-4-mobile">GBF Raid Finder</h1>
      </b-navbar-item>
      <b-navbar-item tag="div">
        <a class="button is-primary" @click="openModal">Add Raid</a>
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-danger" @click="resetFeed">
            <b>Clear</b>
          </a>
          <a class="button" href="https://github.com/kalvin807/gbf-raid-finder" target="_blank" ref="noopener noreferrer">Github</a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: "nav-bar",
  methods: {
    openModal() {
      this.$emit("openModal");
    },
    resetFeed() {
      this.$emit("resetFeed");
    },
  },
};
</script>

<style>
.navbar-menu{
  background: none !important;
}
</style>
