<template>
  <b-navbar fixed-top shadow>
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
            <strong>Reset</strong>
          </a>
          <a class="button is-primary">Github</a>
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
</style>
