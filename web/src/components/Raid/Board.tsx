import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { Text } from 'rebass'
import Column, { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { Bell, BellOff, Clipboard, Circle, X } from 'react-feather'
import { Separator } from '../../theme/components'
import { selectAtom, useAtomValue } from 'jotai/utils'
import { boardAtomsAtom, Board as BoardType, readMsgStoreAtom } from 'atoms/wsAtoms'
import { PrimitiveAtom, useAtom } from 'jotai'
import deepEquals from 'fast-deep-equal'
import TweetRow from 'components/TweetRow'

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(600px, 100%), 1fr));
  grid-gap: 16px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  gap: 8px;
`};
`

const StyledBoard = styled(Column)`
  min-width: min(600px, 100%);
  background-color: ${({ theme }) => theme.bg1};
  display: flex;
  position: relative;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 0.5rem 1rem 1.125rem 1rem;
  * {
    color: ${({ theme }) => theme.text1};
    text-decoration: none !important;
  }
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

const TweetsBoard = ({ atom }: { atom: PrimitiveAtom<BoardType> }) => {
  const [boardInfo, setBoard] = useAtom(atom)
  const { id, en, isAlert, isAutoCopy } = boardInfo

  const raidMsgAtom = useMemo(() => selectAtom(readMsgStoreAtom, (store) => store[id], deepEquals), [id])
  const msgs = useAtomValue(raidMsgAtom) || []

  const toggleCopy = () => setBoard((prev) => ({ ...prev, isAutoCopy: !prev.isAutoCopy }))
  const toggleAlert = () => setBoard((prev) => ({ ...prev, isAlert: !prev.isAlert }))

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
            <StyledButton
              onClick={() => {
                console.log('hi')
              }}
            >
              <X size={20} />
            </StyledButton>
          </RowFixed>
        </RowBetween>
      </HeaderColumn>
      <Separator />
      {msgs.map((m, index) => {
        return <TweetRow message={m} key={`${id}-${index}`} />
      })}
    </StyledBoard>
  )
}

export default function Boards() {
  const boards = useAtomValue(boardAtomsAtom) || []
  return (
    <BoardGrid>
      {boards.map((board, index) => (
        <TweetsBoard atom={board} key={index} />
      ))}
    </BoardGrid>
  )
}
