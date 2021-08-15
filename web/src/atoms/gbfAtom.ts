import { atom } from 'jotai'

import { API_URL } from 'statics/constant'

export interface Category {
  en: string
  ja: string
}

export type Categories = Record<string, Category>

export interface Raid {
  id: number
  category: string
  element: string
  image: string
  en: string
  jp: string
}

const fetchJson = (endpoint: string) =>
  fetch(`${API_URL}/${endpoint}`)
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      }
      throw new Error(`${res.status}: ${res.statusText}`)
    })
    .catch((e) => console.log(e))

export const fetchCategory = (): Promise<any> => fetchJson('category')
export const fetchRaid = (): Promise<any> => fetchJson('raid')

export const categoryAtom = atom<Categories>({})
export const raidAtom = atom<Raid[]>([])
