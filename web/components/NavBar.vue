<template>
  <v-app-bar class="grey darken-3" dark elevation="5" fixed>
    <v-toolbar-title>GBF Raid Finder</v-toolbar-title>
    <v-spacer></v-spacer>
    <RaidModal />
    <v-menu bottom open-on-hover offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="resetFeed">
          <v-list-item-title
            ><span class="danger">Reset</span></v-list-item-title
          >
        </v-list-item>
        <v-list-item
          ref="noopener noreferrer"
          href="https://github.com/kalvin807/gbf-raid-finder"
          target="_blank"
        >
          <v-list-item-title>Github</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import RaidModal from './RaidModal'
export default {
  name: 'NavBar',
  components: {
    RaidModal,
  },
  methods: {
    resetFeed() {
      this.$emit('resetFeed')
    },
  },
}
</script>

<style scoped>
.danger {
  color: #e53935;
}
</style>
