<template>
  <v-app-bar class="deep-purple darken-4" dark elevation="5" fixed>
    <v-toolbar-title>{{ $t('title') }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <RaidModal />
    <v-menu bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">{{ $t('lang') }}</v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="lang in $i18n.locales"
          :key="lang.code"
          :value="lang.code"
          @click="$i18n.setLocale(lang.code)"
        >
          <v-list-item-title>{{ lang.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu bottom open-on-hover offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="resetFeed">
          <v-list-item-title
            ><span class="danger">{{
              $t('resetBtnText')
            }}</span></v-list-item-title
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
  components: {
    RaidModal,
  },
  methods: {
    resetFeed() {
      this.$store.commit('resetFeed')
    },
  },
}
</script>

<style scoped>
.danger {
  color: #e53935;
}
</style>
