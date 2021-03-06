<template>
  <client-only>
    <v-dialog v-model="isModalActive" max-width="960">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon dark v-bind="attrs" v-on="on">
          <v-icon>mdi-plus-box</v-icon>
        </v-btn>
      </template>

      <v-card class="mx-auto blue-grey darken-4">
        <!-- Filter-->
        <v-card-actions class="card">
          <v-card-title>
            <span class="text-subtitle-2 text-sm-h5">{{
              $t('modalTitle')
            }}</span>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="red accent-3" text @click="clearAllSelect">{{
            $t('modalClear')
          }}</v-btn>
          <v-btn text @click="show = !show">
            {{ $t('modalFilter') }}
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="show">
            <v-container fluid>
              <v-row dense align="center" justify="center">
                <v-col>
                  <v-text-field
                    v-model="filterStr"
                    outlined
                    dense
                    :label="$t('modalSearchText')"
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="auto">
                  <v-btn-toggle v-model="selectedElements" dark dense multiple>
                    <template v-for="ele in raidElements">
                      <v-btn
                        :key="ele"
                        :value="ele"
                        icon
                        class="blue-grey darken-4"
                      >
                        <v-img cover eager :src="makeSpriteUri(ele)"></v-img>
                      </v-btn>
                    </template>
                  </v-btn-toggle>
                </v-col>
                <v-col>
                  <v-select
                    v-model="selectedTypes"
                    item-value="en"
                    :item-text="$i18n.locale"
                    :items="category"
                    :label="$t('modalRaidDropdownText')"
                    multiple
                    outlined
                    dark
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-expand-transition>
        <v-container class="body">
          <!-- Card Body -->
          <transition-group name="raids-feed" tag="v-row" class="dense">
            <RaidOptionCard
              v-for="raid in filterSearch"
              :key="raid.index"
              :raid="raid"
              @click="selectRaid(raid)"
            />
          </transition-group>
        </v-container>
      </v-card>
    </v-dialog>
  </client-only>
</template>

<script>
import RaidOptionCard from './RaidOptionCard'
export default {
  name: 'RaidModal',
  components: {
    RaidOptionCard,
  },
  data() {
    return {
      isModalActive: false,
      show: false,
      selectedTypes: [],
      selectedElements: [],
      filterStr: '',
    }
  },
  computed: {
    raids() {
      return this.$store.state.raids
    },
    category() {
      return this.$store.state.category
    },
    raidElements() {
      return this.$store.state.elements
    },
    filterSearch() {
      const { selectedTypes, selectedElements, filterStr } = this
      const typeSet = new Set(selectedTypes)
      const eleSet = new Set(selectedElements)
      return this.raids.filter((v) => {
        const isType = typeSet.size > 0 ? typeSet.has(v.category) : true
        const isElement =
          eleSet.size > 0 ? eleSet.has(v.element.toLowerCase()) : true
        const isMatch = filterStr
          ? v.en.toLowerCase().includes(filterStr.toLowerCase()) ||
            v.jp.toLowerCase().includes(filterStr.toLowerCase())
          : true
        return isType && isElement && isMatch
      })
    },
  },
  watch: {
    raidElements() {
      this.selectedElements = this.raidElements
    },
  },
  methods: {
    selectRaid(event) {
      this.$store.commit('toggleSelected', event.index)
    },
    clearAllSelect() {
      this.selectedTypes = []
      this.selectedElements = []
      this.filterStr = ''
      this.$store.commit('resetSelected', event.index)
    },
    makeSpriteUri(name) {
      return `/img/sprites/${name.toLowerCase()}.png`
    },
  },
}
</script>

<style scoped>
.body {
  overflow-y: auto;
}

@media (min-height: 500px) {
  .body {
    height: 50vh;
  }
}

@media (min-height: 1024px) {
  .body {
    height: 600px;
  }
}
.card {
  overflow-y: hidden !important;
}
.raids-feed-enter-active,
.raids-feed-leave-active {
  opacity: 1;
  transition: all 0.3s ease;
}
.raids-feed-enter,
.raids-feed-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
