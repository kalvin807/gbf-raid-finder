import React, { memo, useCallback, useMemo } from 'react'
import { Bell, BellOff, Clipboard, PlusSquare, X, XCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { withImmer } from 'jotai/immer'
import { focusAtom } from 'jotai/optics'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { Text } from 'rebass/styled-components'
import styled from 'styled-components/macro'

import { raidAtom } from 'atoms/gbfAtom'
import { BoardAtom, boardsAtom, boardsIdAtom, MessagesAtom, messageStoreAtom, reduceBoardsAtom } from 'atoms/wsAtoms'
import useToggle from 'hooks/useToggle'
import { Separator } from 'theme/components'

import SelectRaid from './SelectRaid/'
import { LightCard } from './Card'
import { AutoColumn } from './Column'
import { IconWrapper } from './Icon'
import { Motd } from './Motd'
import { RowBetween, RowFixed } from './Row'
import Tooltip from './Tooltip'
import { LatestTweetRow, TweetRow } from './TweetRow'

type DeleteFn = (id: string) => void

const TweetsContainer = ({
  atom,
  isAutoCopy,
  isAlert,
}: {
  atom: MessagesAtom
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

const TweetBoardController = memo(function TweetBoardController({
  id,
  boardAtom,
  deleteBoard,
  toggleModal,
}: {
  id: string
  boardAtom: BoardAtom
  deleteBoard: DeleteFn
  toggleModal: () => void
}) {
  const { i18n, t } = useTranslation()
  const raid = useAtomValue(raidAtom)
  const [board, setBoard] = useAtom(boardAtom)
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

  const showRaidOrCount = () => {
    const subscribe = board.subscribe
    if (subscribe.length === 0) {
      return `${t('add_raid')} 👉`
    } else if (subscribe.length === 1) {
      return i18n.language === 'en' ? raid[subscribe[0]]?.en : raid[subscribe[0]]?.jp
    } else {
      return `${subscribe.length} ${t('raid_selected')}`
    }
  }

  return (
    <RowBetween>
      <RowFixed>
        <Text fontWeight={500} fontSize={16}>
          {showRaidOrCount()}
        </Text>
      </RowFixed>
      <RowFixed>
        <Tooltip content={t('add_raid_tooltip')}>
          <StyledButton onClick={toggleModal} aria-label="auto-alert" className="umami--click--add-raid">
            <PlusSquare size={20} />
          </StyledButton>
        </Tooltip>
        <Tooltip content={t('toggle_alarm_tooltip')}>
          <StyledButton onClick={toggleAlert} aria-label="auto-alert">
            {isAlert ? <Bell size={20} /> : <BellOff size={20} />}
          </StyledButton>
        </Tooltip>
        <Tooltip content={t('auto_copy_tooltip')}>
          <StyledButton onClick={toggleCopy} aria-label="auto-copy">
            {isAutoCopy ? <Clipboard size={20} /> : <XCircle size={20} />}
          </StyledButton>
        </Tooltip>
        <Tooltip content={t('close_board_tooltip')}>
          <StyledButton onClick={() => deleteBoard(id)} aria-label="close-twitter-board">
            <X size={20} />
          </StyledButton>
        </Tooltip>
      </RowFixed>
    </RowBetween>
  )
})

const TweetsBoard = ({ id, deleteBoard }: { id: string; deleteBoard: DeleteFn }) => {
  const [isOpen, toggleModal] = useToggle(false)
  const boardAtom = useMemo(() => withImmer(focusAtom(boardsAtom, (optic) => optic.prop(id))), [id])
  const msgAtom = useMemo(() => withImmer(focusAtom(messageStoreAtom, (optic) => optic.prop(id))), [id])
  const board = useAtomValue(boardAtom)
  const { isAlert, isAutoCopy } = board

  return (
    <>
      <StyledBoard>
        <HeaderColumn gap="16px" justify="center">
          <TweetBoardController boardAtom={boardAtom} id={id} deleteBoard={deleteBoard} toggleModal={toggleModal} />
        </HeaderColumn>
        <Separator />
        <TweetsContainer atom={msgAtom} isAutoCopy={isAutoCopy} isAlert={isAlert} />
      </StyledBoard>
      {isOpen && <SelectRaid atom={boardAtom} isOpen={isOpen} onDismiss={toggleModal} />}
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
  const boardIds = useAtomValue(boardsIdAtom)
  const updateBoards = useUpdateAtom(reduceBoardsAtom)
  const deleteBoard: DeleteFn = (id) => updateBoards({ type: 'REMOVE', value: id })

  const isEmpty = boardIds && boardIds.length === 0
  return (
    <PageWrapper>
      <BoardGrid>
        {isEmpty ? (
          <MotdBoard />
        ) : (
          boardIds.map((id) => {
            return <TweetsBoard key={id} id={id} deleteBoard={deleteBoard} />
          })
        )}
      </BoardGrid>
    </PageWrapper>
  )
}

export default Boards

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(450px, 100%), 1fr));
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
