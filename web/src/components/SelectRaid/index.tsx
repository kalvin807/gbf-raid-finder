import React, { lazy, useState, useCallback } from 'react'
import styled from 'styled-components/macro'
import { ButtonSecondary } from '../Button'
import { darken } from 'polished'

const LazySelectRaidModal = lazy(() => import('./SelectRaidModal'))

const SelectRaid = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleDismiss = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <>
      <SelectRaidButton onClick={() => setModalOpen(true)}>Select Raid</SelectRaidButton>
      <LazySelectRaidModal isOpen={modalOpen} onDismiss={handleDismiss} />
    </>
  )
}

const TabGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const SelectRaidButton = styled(TabGeneric)`
  font-weight: 500;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};

  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
    color: ${({ theme }) => darken(0.05, theme.primaryText1)};
  }
`

export default SelectRaid
