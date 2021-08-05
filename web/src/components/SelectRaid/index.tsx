import React, { useCallback, useMemo } from 'react'
import { useAtom } from 'jotai'

import { modalAtom } from 'atoms/settingsAtom'

import SelectRaidModal from './SelectRaidModal'

const SelectRaid = () => {
  const [modalOpen, setModalOpen] = useAtom(modalAtom)
  const handleDismiss = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return useMemo(() => <SelectRaidModal isOpen={modalOpen} onDismiss={handleDismiss} />, [modalOpen, handleDismiss])
}

export default SelectRaid