import { atom, PrimitiveAtom } from 'jotai'

import { API_URL } from 'statics/constant'

export interface Category {
  id: string
  en: string
  ja: string
  isSelected: boolean
}

export interface Raid {
  id: number
  category: string
  element: string
  image: string
  en: string
  jp: string
  isSelected: boolean
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

export const categoryAtom = atom<PrimitiveAtom<Category>[]>([])
export const raidAtom = atom<PrimitiveAtom<Raid>[]>([])
export const nameFilterAtom = atom<string>('')

export const filteredRaidAtom = atom<PrimitiveAtom<Raid>[]>((get) => {
  const categoryFilter = get(categoryAtom).filter((atom) => get(atom).isSelected)
  const nameFilter = get(nameFilterAtom)
  const raids = get(raidAtom)
  if (categoryFilter.length === 0 && !nameFilter) return raids
  const categoryKeys = categoryFilter.map((atom) => get(atom).id)
  const filtered = raids.filter((atom) => {
    const item = get(atom)
    const nameMatch = nameFilter
      ? item.en.toLowerCase().includes(nameFilter.toLowerCase()) ||
        item.jp.toLowerCase().includes(nameFilter.toLowerCase())
      : true
    const categoryMatch = categoryKeys.length ? categoryKeys.includes(item.category) : true
    return nameMatch && categoryMatch
  })
  return filtered
})
