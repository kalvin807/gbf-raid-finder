export const state = () => ({
  selected: [],
  raids: [],
  elements: ['fire', 'water', 'earth', 'wind', 'light', 'dark', 'none'],
  msgFeed: [],
  webpSupport: true,
  category: [],
})

export const mutations = {
  setRaids(state, data) {
    state.raids = Object.freeze(data)
  },
  setElements(state, data) {
    state.elements = Object.freeze(data)
  },
  setCategory(state, data) {
    state.category = Object.freeze(data)
  },
  toggleSelected(state, data) {
    const set = new Set(state.selected)
    if (set.has(data)) set.delete(data)
    else set.add(data)
    state.selected = [...set]
  },
  resetSelected(state) {
    state.selected = []
  },
  insertFeed(state, data) {
    const { timeStamp, data: msgRaw } = data
    const { msgFeed, raids } = state
    const msg = JSON.parse(msgRaw)
    const raidID = msg.raid
    const raid = raids[raidID]
    if (msgFeed.length > 30) {
      msgFeed.pop()
    }
    msgFeed.unshift({
      ...raid,
      ...msg,
      timeStamp: msg.timestamp,
      key: `${timeStamp}${msg.roomId}`,
    })
  },
  resetFeed(state) {
    state.msgFeed = []
  },
  setWebpSupport(state, data) {
    state.webpSupport = data
  },
}
