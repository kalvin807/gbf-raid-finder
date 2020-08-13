<template>
  <section>
    <div class="buttons">
      <button id="fab" class="button is-primary is-medium" @click="isModalActive = true">Add Raid</button>
    </div>

    <b-modal :active.sync="isModalActive" :width="640" scroll="clip">
      <div class="card">
        <div class="card-content">
          <b-field>
            <b-input placeholder="Search..." type="search" icon-pack="fas" icon="search"></b-input>
          </b-field>
          <b-field grouped>
            <b-field>
              <b-checkbox-button v-model="checkboxGroup" native-value="Nope" type="is-danger">Nope</b-checkbox-button>
              <b-checkbox-button v-model="checkboxGroup" native-value="Yep" type="is-success">Yep</b-checkbox-button>
              <b-checkbox-button v-model="checkboxGroup" native-value="Default">Default</b-checkbox-button>
              <b-checkbox-button v-model="checkboxGroup" native-value="Disabled">Disabled</b-checkbox-button>
            </b-field>

            <b-select placeholder="Select a name" expanded>
              <option
                v-for="option in data"
                :value="option.id"
                :key="option.id"
              >{{ option.user.first_name }}</option>
            </b-select>
          </b-field>
        </div>
        <div class="buttons is-right">
          <button class="button is-success">
            <b>Save</b>
          </button>
          <button class="button" @click="isModalActive = false">Cancel</button>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isModalActive: false,
      checkboxGroup: [],
    };
  },
};
</script>

<style scoped>
#fab {
  position: absolute;
  right: 5vw;
  bottom: 5vh;
}
</style>
