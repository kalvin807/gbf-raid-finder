export const state = () => ({
  selected: [],
  raids: [],
  elements: ['fire', 'water', 'earth', 'wind', 'light', 'dark', 'none'],
  types: [],
  msgFeed: [],
  webpSupport: true,
})

export const mutations = {
  setRaids(state, data) {
    state.raids = Object.freeze(data)
  },
  setElements(state, data) {
    state.elements = Object.freeze(data)
  },
  setTypes(state, data) {
    state.types = Object.freeze(data)
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
    const msg = JSON.parse(msgRaw)
    const raidID = msg.raid
    const raid = state.raids[raidID]
    state.msgFeed.push({
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
