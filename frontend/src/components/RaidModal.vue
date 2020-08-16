<template>
  <section>
    <b-modal :active="isModalActive" :on-cancel="onCancel" has-modal-card>
      <div class="card modal-card">
        <!-- Card Header -->
        <b-collapse class="card" animation="slide">
          <div
            slot="trigger"
            slot-scope="props"
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Add Raids</p>
            <a class="card-header-icon">
              <span>
                Filter
                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
              </span>
            </a>
          </div>
          <div class="column">
            <b-field>
              <b-input v-model="filterStr" placeholder="Search..." type="search" icon="magnify"></b-input>
            </b-field>
            <div class="columns is-vcentered is-centered">
              <div class="column">
                <template v-for="ele in raidElements">
                  <b-checkbox :key="ele" v-model="selectedElements" :native-value="ele">{{ele}}</b-checkbox>
                </template>
              </div>
              <div class="column">
                <multiselect
                  v-model="selectedTypes"
                  :options="raidTypes"
                  :multiple="true"
                  :searchable="false"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :taggable="true"
                  placeholder="Pick a value"
                ></multiselect>
              </div>
            </div>
          </div>
        </b-collapse>

        <!-- Card Body -->
        <ul class="card-body">
          <RaidOptionCard
            v-for="raid in filterSearch"
            :raid="raid"
            :key="raid.index"
            @click="selectRaid(raid)"
          />
        </ul>
      </div>
    </b-modal>
  </section>
</template>

<script>
import Multiselect from "vue-multiselect";
import RaidOptionCard from "./RaidOptionCard";
export default {
  name: "raid-modal",
  components: {
    RaidOptionCard,
    Multiselect,
  },
  props: {
    raids: Array,
    raidTypes: Array,
    raidElements: Array,
    isModalActive: Boolean,
  },
  data() {
    return {
      selectedRaids: new Set(),
      selectedTypes: [],
      selectedElements: [],
      filterStr: "",
    };
  },
  methods: {
    selectRaid(event) {
      const { index, selected } = event;
      this.raids[index].selected = !selected;
      if (this.selectedRaids.has(index)) this.selectedRaids.delete(index);
      else this.selectedRaids.add(index);

      this.$emit("onSelectChange", this.selectedRaids);
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    onCancel() {
      this.$emit("onClose");
    },
  },
  computed: {
    filterSearch() {
      const { selectedTypes, selectedElements, filterStr } = this;
      const typeSet = new Set(selectedTypes);
      const eleSet = new Set(selectedElements);
      return this.raids.filter((v) => {
        const isType = typeSet.size > 0 ? typeSet.has(v.category) : true;
        const isElement = eleSet.has(v.element);
        const isMatch = filterStr
          ? v.en.includes(filterStr) || v.jp.includes(filterStr)
          : true;
        return isType && isElement && isMatch;
      });
    },
  },
  watch: {
    raidElements() {
      this.selectedElements = this.raidElements;
    },
  },
};
</script>

<style scoped>
#fab {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
}
.card-body {
  overflow-y: auto;
  outline: solid 2px rgba(10, 10, 10, 0.1);
}

@media (min-height: 500px) {
  .card-body {
    height: 50vh;
  }
}

@media (min-height: 1024px) {
  .card-body {
    height: 600px;
  }
}
.modal-card {
  overflow-y: hidden !important;
}
</style>
