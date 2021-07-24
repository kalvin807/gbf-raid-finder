import { atom } from 'jotai'

type Category = {
  [key: string]: string
}

const fetchJson = (endpoint: string) =>
  fetch('https://gbf-raids-finder.herokuapp.com/' + endpoint)
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      }
      throw new Error(`${res.status}: ${res.statusText}`)
    })
    .catch((err) => {
      console.log(err)
    })

export const fetchCategory = (): Promise<Category> => fetchJson('category')
export const fetchRaid = (): Promise<any> => fetchJson('raid')

export const categoryAtom = atom<Category>({})
export const raidAtom = atom({})
