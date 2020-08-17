<template>
  <div id="app" class="is-clipped">
    <NavBar @openModal="openModal" @resetFeed="resetFeed" />
    <transition-group name="raids-feed" class="column raids-feed" style="overflow-y=auto" tag="div">
      <RaidMsgCard v-for="msg in reverseFeed" :msg="msg" :key="msg.key" />
    </transition-group>
    <RaidModal
      :raids="raids"
      :raidTypes="raidTypes"
      :raidElements="raidElements"
      :isModalActive="isModalActive"
      @onSelectChange="updateFilter"
      @onClose="closeModal"
    />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import RaidModal from "./components/RaidModal";
import RaidMsgCard from "./components/RaidMsgCard";
import { get } from "./api";

export default {
  name: "App",
  components: {
    NavBar,
    RaidModal,
    RaidMsgCard,
  },
  data() {
    return {
      ws: null,
      msgFeed: [],
      raids: [],
      raidTypes: [],
      raidElements: [],
      filterStr: "",
      isModalActive: false,
    };
  },
  methods: {
    getRaids() {
      get("/static", "raid.json")
        .then((res) => {
          this.raids = res.map((v, idx) => ({
            ...v,
            index: idx,
            selected: false,
            active: true,
          }));
          this.raidElements = [...new Set(this.raids.map((v) => v.element))];
          this.raidTypes = [...new Set(this.raids.map((v) => v.category))].sort(
            function (a, b) {
              if (a < b) return -1;
              else if (a > b) return 1;
              return 0;
            }
          );
        })
        .catch((err) => console.log(err));
    },
    updateFilter(selected) {
      console.log(selected);
      const req = {
        raid: [...selected],
      };
      this.wsSend(JSON.stringify(req));
    },
    initWebSocket() {
      const wsuri = "ws://192.168.1.30:8080/ws";
      this.ws = new WebSocket(wsuri);
      this.ws.onmessage = this.onMessage;
      this.ws.onopen = this.onOpen;
      this.ws.onerror = this.onError;
      this.ws.onclose = this.onClose;
    },
    onMessage(event) {
      console.log(event);
      const msg = JSON.parse(event.data);
      const raid = this.raids[msg.raid];
      this.msgFeed.push({
        jp: raid.jp,
        en: raid.en,
        msg: msg.msg,
        roomId: msg.roomId,
        key: `${event.timeStamp}${msg.roomId}`,
      });
    },
    onOpen() {
      console.log("WS connected");
    },
    onError() {
      console.log("Failed!");
    },
    onClose() {
      console.log("Bye!");
    },
    wsSend(data) {
      this.ws.send(data);
    },
    openModal() {
      this.isModalActive = true;
    },
    closeModal() {
      this.isModalActive = false;
    },
    resetFeed() {
      this.msgFeed = [];
    },
  },
  created() {
    this.initWebSocket();
    this.getRaids();
  },
  destroyed() {
    this.ws.close();
  },
  computed: {
    reverseFeed() {
      return this.msgFeed.slice().reverse();
    },
  },
};
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif, Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  touch-action: manipulation;
}
.raids-feed {
  height: 100%;
  padding: 0 !important;
}
</style>
