import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/macro'
import { TYPE } from 'theme'
import { StyledLink } from '../theme'
import { useAtomValue } from 'jotai/utils'
import { Message } from 'atoms/wsAtoms'
import { clockAtom } from 'atoms/settingsAtom'
import { copy } from 'utils/copy'
import { PrimitiveAtom } from 'jotai'
import { useImmerAtom } from 'jotai/immer'
import useSound from 'use-sound'
import notiSfx from '../statics/sounds/noti.mp3'

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

const ResponsiveText = styled(TYPE.main)`
  text-overflow: ellipsis;
  overflow: hidden;
  align-items: center;
  display: flex;
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
  `};
`

export const StyledTweetRow = styled(StyledLink)`
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
  const [play] = useSound(notiSfx)

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
    if (isAlert) play()
  }, [roomId, isAlert, play])

  return <TweetRow atom={atom} />
}

export const TweetRow = ({ atom }: { atom: PrimitiveAtom<Message> }) => {
  const [value, setAtom] = useImmerAtom(atom)
  const [play] = useSound(notiSfx, { interrupt: true })

  const { msg, roomId, timestamp, isCopied } = value
  const copyAtom = () => {
    play()
    copy(roomId)
    setAtom((prev) => ({ ...prev, isCopied: true }))
  }
  return (
    <StyledTweetRow onClick={() => copyAtom()}>
      <IDText>{isCopied ? 'copied' : roomId}</IDText>
      <ResponsiveText>{msg}</ResponsiveText>
      <ElapsedTime timestamp={timestamp} />
    </StyledTweetRow>
  )
}
