import React, { memo, useCallback } from 'react'
import { X } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'
import { Atom, useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { Text } from 'rebass/styled-components'
import styled from 'styled-components/macro'

import { filteredRaidAtom } from 'atoms/gbfAtom'
import { Board, BoardAtom } from 'atoms/wsAtoms'
import { IconWrapper } from 'components/Icon'
import { Separator } from 'theme'

import { LinkStyledButton } from '../Button'
import Column, { AutoColumn } from '../Column'
import Modal from '../Modal'
import Row, { RowBetween, RowFixed } from '../Row'

import Option from './Options'
import SelectRaidFilter from './SelectRaidFilter'

interface SelectRaidProps {
  atom: BoardAtom
  isOpen: boolean
  onDismiss: () => void
}

const RaidList = () => {
  const raids = useAtomValue(filteredRaidAtom)
  return (
    <ListContainer>
      <AutoColumn gap="md">
        {raids.map((atom, index) => (
          <Option atom={atom} key={index} />
        ))}
      </AutoColumn>
    </ListContainer>
  )
}

const SelectModal = memo(function SelectModal({ atom, isOpen, onDismiss }: SelectRaidProps) {
  const { t } = useTranslation()
  const [board, setBoard] = useAtom(atom)
  const { subscribe } = board

  const reset = useCallback(() => setBoard((draft) => (draft.subscribe = [])), [setBoard])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <ContentWrapper>
        <PaddedColumn gap="16px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              <Trans i18nKey="add_raid" t={t}>
                Add Raid
              </Trans>
            </Text>
            <RowFixed>
              <LinkStyledButton onClick={reset}>
                <Trans i18nKey="clear_all" t={t}>
                  Clear all
                </Trans>
              </LinkStyledButton>
              <IconWrapper marginLeft="1rem" onClick={onDismiss} aria-label="close-modal">
                <X />
              </IconWrapper>
            </RowFixed>
          </RowBetween>
          <Row>
            <SelectRaidFilter />
          </Row>
        </PaddedColumn>
        <Separator />
        {/* <RaidList /> */}
      </ContentWrapper>
    </Modal>
  )
})

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`

const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`

const ListContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow: auto;
  padding-bottom: 80px;
`

export default SelectModal
