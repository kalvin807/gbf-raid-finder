import React, { useCallback, useMemo } from 'react'
import { ArrowRight, Bell, BellOff, Clipboard, PlusSquare, X, XCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Atom, PrimitiveAtom, useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { selectAtom, useAtomValue, useUpdateAtom } from 'jotai/utils'
import { Text } from 'rebass/styled-components'
import styled from 'styled-components/macro'

import { BoardAtom, boardsAtom, Message, reduceBoardsAtom } from 'atoms/wsAtoms'
import useToggle from 'hooks/useToggle'
import { Separator } from 'theme/components'

import SelectRaid from './SelectRaid/'
import { LightCard } from './Card'
import { AutoColumn } from './Column'
import { IconWrapper } from './Icon'
import { Motd } from './Motd'
import { RowBetween, RowFixed } from './Row'
import { LatestTweetRow, TweetRow } from './TweetRow'

type DeleteFn = (id: string) => void

const TweetsContainer = ({
  atom,
  isAutoCopy,
  isAlert,
}: {
  atom: Atom<PrimitiveAtom<Message>[]>
  isAutoCopy: boolean
  isAlert: boolean
}) => {
  const msgs = useAtomValue(atom) || []
  return (
    <>
      {msgs.map((m, index) => {
        return index === 0 ? (
          <LatestTweetRow atom={m} key={`${index}`} isAlert={isAlert} isAutoCopy={isAutoCopy} />
        ) : (
          <TweetRow atom={m} key={`${index}`} />
        )
      })}
    </>
  )
}

const TweetsBoard = ({ atom, deleteBoard, id }: { atom: BoardAtom; id: string; deleteBoard: DeleteFn }) => {
  const { i18n } = useTranslation()
  const [isOpen, toggleModal] = useToggle(false)
  const [board, setBoard] = useAtom(atom)
  const { isAlert, isAutoCopy } = board
  const toggleCopy = useCallback(
    () =>
      setBoard((draft) => {
        draft.isAutoCopy = !isAutoCopy
      }),
    [setBoard, isAutoCopy]
  )
  const toggleAlert = useCallback(
    () =>
      setBoard((draft) => {
        draft.isAlert = !isAlert
      }),
    [setBoard, isAlert]
  )
  const onClose = () => deleteBoard(id)

  return (
    <>
      <StyledBoard>
        <HeaderColumn gap="16px" justify="center">
          <RowBetween>
            <RowFixed>
              <Text fontWeight={500} fontSize={16}>
                {'test'}
              </Text>
            </RowFixed>
            <RowFixed>
              <StyledButton onClick={toggleModal} aria-label="auto-alert">
                <PlusSquare size={20} />
              </StyledButton>
              <StyledButton onClick={toggleAlert} aria-label="auto-alert">
                {isAlert ? <Bell size={20} /> : <BellOff size={20} />}
              </StyledButton>
              <StyledButton onClick={toggleCopy} aria-label="auto-copy">
                {isAutoCopy ? <Clipboard size={20} /> : <XCircle size={20} />}
              </StyledButton>
              <StyledButton onClick={onClose} aria-label="close-twitter-board">
                <X size={20} />
              </StyledButton>
            </RowFixed>
          </RowBetween>
        </HeaderColumn>
        <Separator />
        {/* <TweetsContainer atom={raidMsgAtom} isAutoCopy={isAutoCopy} isAlert={isAlert} /> */}
      </StyledBoard>
      <SelectRaid atom={atom} isOpen={isOpen} onDismiss={toggleModal} />
    </>
  )
}

const MotdBoard = () => {
  const { i18n } = useTranslation()
  return (
    <PageWrapper>
      <StyledBoard>
        <Motd lang={i18n.language as 'ja' | 'zh' | 'en'} />
      </StyledBoard>
    </PageWrapper>
  )
}

const Boards = () => {
  const boards = useAtomValue(boardsAtom)
  const updateBoards = useUpdateAtom(reduceBoardsAtom)

  if (Array.isArray(boards)) {
    return (
      <PageWrapper>
        <BoardGrid>
          <MotdBoard />
        </BoardGrid>
      </PageWrapper>
    )
  }

  const deleteBoard: DeleteFn = (id) => updateBoards({ type: 'REMOVE', value: id })
  const isEmpty = boards && Object.keys(boards).length === 0 && boards.constructor === Object
  return (
    <PageWrapper>
      <BoardGrid>
        {isEmpty ? (
          <MotdBoard />
        ) : (
          Object.entries(boards).map(([id, board]) => {
            return <TweetsBoard atom={board} key={id} id={id} deleteBoard={deleteBoard} />
          })
        )}
      </BoardGrid>
    </PageWrapper>
  )
}

export default Boards

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
