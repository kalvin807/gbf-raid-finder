import React, { useMemo } from 'react'
import { Bell, BellOff, Clipboard, X, XCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import deepEquals from 'fast-deep-equal'
import { PrimitiveAtom, useAtom } from 'jotai'
import { selectAtom, useAtomValue, useUpdateAtom } from 'jotai/utils'
import { Text } from 'rebass'
import styled from 'styled-components'

import { Board as BoardType, boardAtomsAtom, readMsgStoreAtom, updateBoardAtom } from 'atoms/wsAtoms'
import { Separator } from 'theme/components'

import { LightCard } from './Card'
import { AutoColumn } from './Column'
import { IconWrapper } from './Icon'
import { EnMotd, JpMotd } from './Motd'
import { RowBetween, RowFixed } from './Row'
import { LatestTweetRow, TweetRow } from './TweetRow'

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(600px, 100%), 1fr));
  grid-gap: 16px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  gap: 8px;
`};
`

const StyledBoard = styled(LightCard)`
  min-width: min(600px, 100%);
  position: relative;
  border-radius: 20px;
  padding: 0.5rem 1rem 1.125rem 1rem;
`

const HeaderColumn = styled(AutoColumn)`
  padding: 1rem 0.125rem 0.5rem 0.125rem;
  width: 100%;
`

export const StyledButton = styled(IconWrapper)`
  margin: 2px 8px 2px 8px;
`

const PageWrapper = styled(AutoColumn)`
  width: 100%;
  margin-bottom: 8px;
  padding: 0 16px 0 16px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: 80px;
    padding: 0 8px 0 8px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0 4px 0 4px;
  `};
`

const TweetsBoard = ({ atom }: { atom: PrimitiveAtom<BoardType> }) => {
  const { i18n } = useTranslation()
  const [boardInfo, setBoard] = useAtom(atom)
  const { id, en, jp, isAlert, isAutoCopy } = boardInfo
  const updateBoard = useUpdateAtom(updateBoardAtom)

  const raidMsgAtom = useMemo(() => selectAtom(readMsgStoreAtom, (store) => store[id], deepEquals), [id])
  const msgs = useAtomValue(raidMsgAtom) || []

  const toggleCopy = () => setBoard((prev) => ({ ...prev, isAutoCopy: !prev.isAutoCopy }))
  const toggleAlert = () => setBoard((prev) => ({ ...prev, isAlert: !prev.isAlert }))
  const onClose = () => updateBoard({ raid: boardInfo, action: 'remove' })

  return (
    <StyledBoard>
      <HeaderColumn gap="16px" justify="center">
        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={16}>
              {i18n.language === 'en' ? en : jp}
            </Text>
          </RowFixed>
          <RowFixed>
            <StyledButton onClick={toggleAlert}>{isAlert ? <Bell size={20} /> : <BellOff size={20} />}</StyledButton>
            <StyledButton onClick={toggleCopy}>
              {isAutoCopy ? <Clipboard size={20} /> : <XCircle size={20} />}
            </StyledButton>
            <StyledButton onClick={onClose}>
              <X size={20} />
            </StyledButton>
          </RowFixed>
        </RowBetween>
      </HeaderColumn>
      <Separator />
      {msgs.map((m, index) => {
        return index === 0 ? (
          <LatestTweetRow atom={m} key={`${id}-${index}`} isAlert={isAlert} isAutoCopy={isAutoCopy} />
        ) : (
          <TweetRow atom={m} key={`${id}-${index}`} />
        )
      })}
    </StyledBoard>
  )
}

const MotdBoard = () => {
  const { i18n } = useTranslation()
  return (
    <PageWrapper>
      <StyledBoard>{i18n.language === 'en' ? <EnMotd /> : <JpMotd />}</StyledBoard>
    </PageWrapper>
  )
}

export default function Boards() {
  const boards = useAtomValue(boardAtomsAtom) || []

  return (
    <PageWrapper>
      <BoardGrid>
        {boards.length ? boards.map((board, index) => <TweetsBoard atom={board} key={index} />) : <MotdBoard />}
      </BoardGrid>
    </PageWrapper>
  )
}
