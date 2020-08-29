export const state = () => ({
  selected: new Set(),
  raids: [],
  elements: ['fire', 'water', 'earth', 'wind', 'light', 'dark', 'none'],
  types: [],
  msgFeed: [],
})

export const mutations = {
  toggleSelected(state, data) {
    const set = new Set(state.selected)
    const prevState = state.raids[data].selected
    state.raids[data].selected = !prevState
    if (set.has(data)) set.delete(data)
    else set.add(data)
    state.selected = [...set]
  },
  setRaids(state, data) {
    state.raids = data
  },
  setElements(state, data) {
    state.elements = Object.freeze(data)
  },
  setTypes(state, data) {
    state.types = Object.freeze(data)
  },
  resetSelected(state) {
    state.selected.forEach((val) => {
      state.raids[val].selected = false
    })
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
}
