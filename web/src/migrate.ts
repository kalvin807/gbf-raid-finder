// Migrating from old format
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const localRecord = localStorage.getItem('board') ? JSON.parse(localStorage.getItem('board')!) : []
if (Array.isArray(localRecord)) {
  localStorage.setItem('board', JSON.stringify({}))
}

export {}
