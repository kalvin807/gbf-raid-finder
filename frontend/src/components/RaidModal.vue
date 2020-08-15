<template>
  <section>
    <div class="buttons">
      <button id="fab" class="button is-primary is-medium" @click="isModalActive = true">Add Raid</button>
    </div>

    <b-modal :active.sync="isModalActive">
      <div class="card is-clipped rounded-modal-card">
        <div class="card-content">
          <b-field>
            <b-input
              v-model="filterStr"
              placeholder="Search..."
              type="search"
              icon-pack="fas"
              icon="search"
            ></b-input>
          </b-field>
          <b-field grouped>
            <b-field>
              <template v-for="ele in raidElements">
                <b-checkbox-button
                  v-model="selectedElements"
                  :native-value="ele"
                  type="is-success"
                  :key="ele"
                >{{ele}}</b-checkbox-button>
              </template>
            </b-field>
            <b-dropdown v-model="selectedTypes" multiple aria-role="list" scrollable>
              <button class="button" type="button" slot="trigger">
                <span>Select Raid Types</span>
                <b-icon pack="fas" icon="angle-down"></b-icon>
              </button>
              <template v-for="type in raidTypes">
                <b-dropdown-item :value="type" aria-role="listitem" :key="type">
                  <span>{{type}}</span>
                </b-dropdown-item>
              </template>
            </b-dropdown>
            <b-tag v-for="type in selectedTypes" style="margin: 0.2em" :key="type">{{type}}</b-tag>
          </b-field>
        </div>

        <div class="card">
          <ul class="card-body">
            <RaidOptionCard
              v-for="raid in filterSearch"
              :raid="raid"
              :key="raid.index"
              @click="selectRaid(raid)"
            />
          </ul>
        </div>

        <div class="card-content"></div>
      </div>
    </b-modal>
  </section>
</template>

<script>
import RaidOptionCard from "./RaidOptionCard";
export default {
  name: "raid-modal",
  components: {
    RaidOptionCard,
  },
  props: {
    raids: Array,
  },
  data() {
    return {
      isModalActive: false,
      raidTypes: [],
      raidElements: [],
      customRaids: [],
      selectedRaids: new Set(),
      selectedTypes: [],
      selectedElements: [],
      filterStr: "",
    };
  },
  methods: {
    selectRaid(event) {
      const { index, selected } = event;
      this.customRaids[index].selected = !selected;
      if (this.selectedRaids.has(index)) this.selectedRaids.delete(index);
      else this.selectedRaids.add(index);

      this.$emit("onSelectChange", this.selectedRaids);
    },
  },
  computed: {
    filterSearch() {
      const { selectedTypes, selectedElements, filterStr } = this;
      const typeSet = new Set(selectedTypes);
      const eleSet = new Set(selectedElements);
      return this.customRaids.filter((v) => {
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
    raids() {
      this.customRaids = this.raids.map((v) => ({
        ...v,
        selected: false,
        active: true,
      }));
      this.raidElements = [...new Set(this.raids.map((v) => v.element))];
      this.selectedElements = this.raidElements;
      this.raidTypes = [...new Set(this.raids.map((v) => v.category))].sort(
        function (a, b) {
          if (a < b) return -1;
          else if (a > b) return 1;
          return 0;
        }
      );
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
}

@media (min-height: 500px) {
  .card-body {
    height: 300px;
  }
}

@media (min-height: 1024px) {
  .card-body {
    height: 600px;
  }
}
.rounded-modal-card {
  border-radius: 1rem;
  margin: 1em 2em;
  overflow-y: hidden !important;
}
</style>
