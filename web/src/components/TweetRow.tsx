import React, { useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { Text } from 'rebass/styled-components'
import styled from 'styled-components/macro'

import { clockAtom, copyActionAtom } from 'atoms/settingsAtom'
import { MessageAtom } from 'atoms/wsAtoms'
import notiSfx from 'statics/sounds/noti.mp3'
import { copy } from 'utils/copy'
import { handleCopyAction } from 'utils/openUrl'

import { StyledLink } from './Button'
import { AutoColumn } from './Column'

const sound = new Audio(notiSfx)

const IDText = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 16px;
  `};
`

const TimeText = styled(Text)`
  align-items: center;
  display: flex;
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `};
  font-weight: 300;
`

const MessageText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  align-items: center;
  display: flex;
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
  `};
`

const StyledTweetRow = styled(StyledLink)<{ copied: boolean }>`
  display: grid;
  grid-template-columns: auto auto;
  gap: 8px;
  justify-content: space-between;
  position: relative;
  padding: 1rem;
  * {
    font-style: ${({ copied }) => (copied ? 'italic' : 'normal')};
    color: ${({ theme, copied }) => (copied ? theme.text4 : theme.text1)};
    text-decoration: none !important;
  }
  :hover {
    background-color: ${({ theme }) => theme.bg2};
    text-decoration: none;
    * {
      text-decoration: none !important;
    }
  }
`

const parseElapsedTime = (ms: number): string => {
  if (ms < 60000) return `${(ms / 1000) >> 0}s`
  return `${(ms / 60000) >> 0}m`
}

const ElapsedTime = ({ timestamp }: { timestamp: Date }) => {
  const now = useAtomValue(clockAtom)
  return <TimeText>{parseElapsedTime(now - timestamp.getTime())} </TimeText>
}

export const LatestTweetRow = ({
  atom,
  isAutoCopy,
  isAlert,
}: {
  atom: MessageAtom
  isAutoCopy: boolean
  isAlert: boolean
}) => {
  const [{ roomId, isCopied }, setAtom] = useAtom(atom)

  const copyAtom = useCallback(() => {
    copy(roomId)
    setAtom((draft) => ({ ...draft, isCopied: true }))
  }, [roomId, setAtom])

  useEffect(() => {
    if (isAutoCopy && !isCopied) {
      copyAtom()
    }
  }, [roomId, isCopied, copyAtom, isAutoCopy])

  useEffect(() => {
    if (isAlert) sound.play()
  }, [roomId, isAlert])

  return <TweetRow atom={atom} />
}

export const TweetRow = ({ atom }: { atom: MessageAtom }) => {
  const [value, setAtom] = useAtom(atom)
  const copyAction = useAtomValue(copyActionAtom)
  const { msg, roomId, timestamp, isCopied, jp, en } = value
  const copyAtom = () => {
    handleCopyAction(copyAction)
    copy(roomId)
    setAtom((prev) => ({ ...prev, isCopied: true }))
  }
  return (
    <StyledTweetRow onClick={() => copyAtom()} copied={isCopied}>
      <AutoColumn gap="sm">
        <IDText>{en}</IDText>
        <MessageText>{roomId}</MessageText>
      </AutoColumn>
      <AutoColumn gap="sm">
        <ElapsedTime timestamp={timestamp} />
        <MessageText>{msg}</MessageText>
      </AutoColumn>
    </StyledTweetRow>
  )
}
