import React, { useCallback, useEffect } from 'react'
import { PrimitiveAtom } from 'jotai'
import { useImmerAtom } from 'jotai/immer'
import { useAtomValue } from 'jotai/utils'
import styled from 'styled-components'

import { clockAtom } from 'atoms/settingsAtom'
import { Message } from 'atoms/wsAtoms'
import notiSfx from 'statics/sounds/noti.mp3'
import { TYPE } from 'theme'
import { copy } from 'utils/copy'

import { StyledLink } from './Button'

const sound = new Audio(notiSfx)

const IDText = styled(TYPE.label)`
  margin-bottom: 24px;
  font-size: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 16px;
  `};
`

const TimeText = styled(TYPE.main)`
  align-items: center;
  display: flex;
  margin-bottom: 24px;
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `};
`

const MessageText = styled(TYPE.main)`
  text-overflow: ellipsis;
  overflow: hidden;
  align-items: center;
  display: flex;
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
  `};
`

const StyledTweetRow = styled(StyledLink)`
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 8px;
  justify-content: space-between;
  position: relative;
  padding: 1rem;
  * {
    color: ${({ theme }) => theme.text1};
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
  atom: PrimitiveAtom<Message>
  isAutoCopy: boolean
  isAlert: boolean
}) => {
  const [{ roomId, isCopied }, setAtom] = useImmerAtom(atom)

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

export const TweetRow = ({ atom }: { atom: PrimitiveAtom<Message> }) => {
  const [value, setAtom] = useImmerAtom(atom)

  const { msg, roomId, timestamp, isCopied } = value
  const copyAtom = () => {
    copy(roomId)
    setAtom((prev) => ({ ...prev, isCopied: true }))
  }
  return (
    <StyledTweetRow onClick={() => copyAtom()}>
      <IDText>{isCopied ? 'copied' : roomId}</IDText>
      <MessageText>{msg}</MessageText>
      <ElapsedTime timestamp={timestamp} />
    </StyledTweetRow>
  )
}
