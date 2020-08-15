<template>
  <div id="app" class="is-clipped">
    <NavBar />
    <transition-group name="raids-feed" class="column raids-feed" style="overflow-y=auto" tag="div">
      <RaidMsgCard v-for="msg in reverseFeed" :msg="msg" :key="msg.key" />
    </transition-group>
    <RaidModal :raids="raids" @onSelectChange="updateFilter" />
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
      raids: [],
      ws: null,
      msgFeed: [],
    };
  },
  methods: {
    getRaids() {
      get("/static", "raid.json")
        .then((res) => {
          this.raids = res.map((v, idx) => ({ ...v, index: idx }));
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
  display: flex;
  height: 100%;
  flex-direction: column-reverse;
}
</style>
