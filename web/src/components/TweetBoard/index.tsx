import { memo, useCallback, useMemo } from 'react'
import { Bell, BellOff, Clipboard, Edit3 as Edit, PlusSquare, Slash, X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { withImmer } from 'jotai/immer'
import { focusAtom } from 'jotai/optics'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { opacify } from 'polished'
import styled from 'styled-components/macro'

import { raidAtom } from 'atoms/gbfAtom'
import { BoardAtom, boardsAtom, boardsIdAtom, MessagesAtom, messageStoreAtom, reduceBoardsAtom } from 'atoms/wsAtoms'
import { LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { IconWrapper } from 'components/Icon'
import { Motd } from 'components/Motd'
import { RowBetween, RowFixed } from 'components/Row'
import SelectRaid from 'components/SelectRaid'
import Tooltip from 'components/Tooltip'
import useToggle from 'hooks/useToggle'
import { Separator } from 'theme/components'

import { LatestTweetRow, TweetRow } from './BoardRow'
import BoardTitle from './BoardTitle'
import RenamePrompt from './RenamePrompt'

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

const NoCopyIcon = () => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          top: -1,
          left: 0,
          zIndex: 1,
        }}
      >
        <Slash size={20} stroke="inherit" />
      </div>
      <Clipboard size={12} opacity="80%" />
    </>
  )
}

const TweetBoardController = memo(function TweetBoardController({
  id,
  boardAtom,
  deleteBoard,
  toggleModal: toggleRaidModal,
}: {
  id: string
  boardAtom: BoardAtom
  deleteBoard: DeleteFn
  toggleModal: () => void
}) {
  const { t } = useTranslation()
  const raid = useAtomValue(raidAtom)
  const [board, setBoard] = useAtom(boardAtom)
  const { isAlert, isAutoCopy } = board
  const [isOpen, toggleRenameModal] = useToggle(false)

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

  const setName = useCallback(
    (name: string) =>
      setBoard((draft) => {
        draft.name = name
      }),
    [setBoard]
  )

  return (
    <RowBetween>
      <RowFixed>
        <BoardTitle board={board} raid={raid} />
      </RowFixed>
      <RowFixed>
        <Tooltip content={t('add_raid_tooltip')}>
          <StyledButton
            onClick={toggleRaidModal}
            aria-label="auto-alert"
            className="umami--click--add-raid"
            size="1rem"
          >
            <PlusSquare size="100%" />
            {board.subscribe.length > 0 && <NotificationBadge>{board.subscribe.length}</NotificationBadge>}
          </StyledButton>
        </Tooltip>
        <Tooltip content={t('rename')}>
          <StyledButton onClick={toggleRenameModal} aria-label="rename-board" size="1rem">
            <Edit size="100%" />
          </StyledButton>
        </Tooltip>
        <RenamePrompt isOpen={isOpen} onDismiss={toggleRenameModal} name={board.name || ''} setName={setName} />
        <Tooltip content={t('toggle_alarm_tooltip')}>
          <StyledButton onClick={toggleAlert} aria-label="auto-alert" size="1rem">
            {isAlert ? <Bell size="100%" /> : <BellOff size="100%" />}
          </StyledButton>
        </Tooltip>
        <Tooltip content={t('auto_copy_tooltip')}>
          <StyledButton onClick={toggleCopy} aria-label="auto-copy" size="1rem">
            {isAutoCopy ? <Clipboard size="100%" /> : <StyledNoCopyIcon />}
          </StyledButton>
        </Tooltip>
        <Tooltip content={t('close_board_tooltip')}>
          <StyledButton onClick={() => deleteBoard(id)} aria-label="close-twitter-board" size="1rem">
            <X size="100%" strokeWidth={3} />
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

const NotificationBadge = styled.div`
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
  min-width: 1.8em; /* or width, explained below. */
  height: 1.8em;
  border-radius: 0.8em; /* or 50%, explained below. */
  border: 0.05em solid ${({ theme }) => theme.primary5};
  background-color: ${({ theme }) => opacify(0.5)(theme.primary5)};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text1};
`

const StyledNoCopyIcon = styled(NoCopyIcon)`
  stroke: inherit;
`
