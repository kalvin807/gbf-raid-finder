<template>
  <v-app id="app" data-app="true">
    <NavBar />
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from '../components/NavBar'
export default {
  components: {
    NavBar,
  },
  head() {
    return this.$nuxtI18nSeo()
  },
}
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
