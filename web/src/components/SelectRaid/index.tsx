import React, { lazy, useMemo } from 'react'
import { atom } from 'jotai'

import { raidAtom } from 'atoms/gbfAtom'
import { BoardAtom } from 'atoms/wsAtoms'

export interface SelectRaidProps {
  atom: BoardAtom
  isOpen: boolean
  onDismiss: () => void
}

const SelectRaidModal = lazy(() => import('./SelectRaidModal'))

const SelectRaid = (props: SelectRaidProps) => {
  const categoryFilterAtom = useMemo(() => atom<string[]>([]), [])
  const nameFilterAtom = useMemo(() => atom<string>(''), [])
  const filterRaidAtom = useMemo(
    () =>
      atom((get) => {
        const categoryFilter = get(categoryFilterAtom)
        const nameFilter = get(nameFilterAtom)
        const raids = get(raidAtom)
        if (categoryFilter.length === 0 && !nameFilter) return raids
        const filtered = raids.filter((item) => {
          const isNameMatch = nameFilter
            ? item.en.toLowerCase().includes(nameFilter.toLowerCase()) ||
              item.jp.toLowerCase().includes(nameFilter.toLowerCase())
            : true
          const isCategoryMatch = categoryFilter.length ? categoryFilter.includes(item.category) : true
          return isNameMatch && isCategoryMatch
        })
        return filtered
      }),
    [categoryFilterAtom, nameFilterAtom]
  )

  return (
    <SelectRaidModal
      {...props}
      raidAtom={filterRaidAtom}
      categoryFilterAtom={categoryFilterAtom}
      nameFilterAtom={nameFilterAtom}
    />
  )
}
export default SelectRaid
