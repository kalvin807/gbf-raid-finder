import React, { useMemo } from 'react'
import { Bell, BellOff, Circle, Clipboard, X } from 'react-feather'
import deepEquals from 'fast-deep-equal'
import { PrimitiveAtom, useAtom } from 'jotai'
import { selectAtom, useAtomValue, useUpdateAtom } from 'jotai/utils'
import { Text } from 'rebass'
import styled from 'styled-components'

import { Board as BoardType, boardAtomsAtom, readMsgStoreAtom, updateBoardAtom } from 'atoms/wsAtoms'

import { Separator } from '../theme/components'

import { LightCard } from './Card'
import Column, { AutoColumn } from './Column'
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

export const StyledButton = styled.button`
  height: 24px;
  width: 24px;
  border: none;
  background-color: transparent;
  margin: 2px 8px 2px 8px;
  padding: 0;
  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    opacity: 0.7;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
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
  const [boardInfo, setBoard] = useAtom(atom)
  const { id, en, isAlert, isAutoCopy } = boardInfo
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
              {en}
            </Text>
          </RowFixed>
          <RowFixed>
            <StyledButton onClick={toggleAlert}>{isAlert ? <Bell size={20} /> : <BellOff size={20} />}</StyledButton>
            <StyledButton onClick={toggleCopy}>
              {isAutoCopy ? <Clipboard size={20} /> : <Circle size={20} />}
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

export default function Boards() {
  const boards = useAtomValue(boardAtomsAtom) || []
  return (
    <PageWrapper>
      <BoardGrid>
        {boards.map((board, index) => (
          <TweetsBoard atom={board} key={index} />
        ))}
      </BoardGrid>
    </PageWrapper>
  )
}
