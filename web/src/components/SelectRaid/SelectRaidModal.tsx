import React, { memo, useCallback } from 'react'
import { X } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'
import { Atom, PrimitiveAtom, useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { Text } from 'rebass/styled-components'
import styled from 'styled-components/macro'

import { Raid } from 'atoms/gbfAtom'
import { LinkStyledButton } from 'components/Button'
import Column, { AutoColumn } from 'components/Column'
import { IconWrapper } from 'components/Icon'
import ModalV2 from 'components/ModalV2'
import Row, { RowBetween, RowFixed } from 'components/Row'
import { Separator } from 'theme'

import Option from './Options'
import SelectRaidFilter from './SelectRaidFilter'
import { SelectRaidProps } from '.'

interface SelectRaidModalProps extends SelectRaidProps {
  raidAtom: Atom<Raid[]>
  categoryFilterAtom: PrimitiveAtom<string[]>
  nameFilterAtom: PrimitiveAtom<string>
}

export type ToggleFn = (id: number) => void

const RaidList = ({ atom, subscribed, toggle }: { atom: Atom<Raid[]>; subscribed: number[]; toggle: ToggleFn }) => {
  const raids = useAtomValue(atom)
  return (
    <ListContainer>
      <AutoColumn gap="sm">
        {raids.map((item, index) => (
          <Option raid={item} key={index} active={subscribed.includes(item.id)} toggle={toggle} />
        ))}
      </AutoColumn>
    </ListContainer>
  )
}

const SelectModal = memo(function SelectModal({
  atom,
  isOpen,
  onDismiss,
  raidAtom,
  categoryFilterAtom,
  nameFilterAtom,
}: SelectRaidModalProps) {
  const { t } = useTranslation()
  const [board, setBoard] = useAtom(atom)

  const { subscribe } = board

  const toggleSubscribe = useCallback(
    (id: number) =>
      setBoard((draft) => {
        const prev = draft.subscribe
        const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        draft.subscribe = next
        return draft
      }),
    [setBoard]
  )
  const reset = useCallback(
    () =>
      setBoard((draft) => {
        draft.subscribe = []
      }),
    [setBoard]
  )

  return (
    <ModalV2 open={isOpen} onClose={onDismiss} maxHeight={80} minHeight={80}>
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
            <SelectRaidFilter categoryFilterAtom={categoryFilterAtom} nameFilterAtom={nameFilterAtom} />
          </Row>
        </PaddedColumn>
        <Separator />
        <RaidList atom={raidAtom} subscribed={subscribe} toggle={toggleSubscribe} />
      </ContentWrapper>
    </ModalV2>
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
