<template>
  <div id="app">
    <NavBar />

    <RaidModal />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import RaidModal from "./components/RaidModal";

export default {
  name: "App",
  components: {
    NavBar,
    RaidModal,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
