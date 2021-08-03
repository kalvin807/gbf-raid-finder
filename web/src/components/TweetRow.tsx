import React from 'react'
import styled from 'styled-components/macro'
import { TYPE } from 'theme'
import { StyledLink } from '../theme'
import { useAtomValue } from 'jotai/utils'
import { Message } from 'atoms/wsAtoms'
import { clockAtom } from 'atoms/settingsAtom'
import { copy } from 'utils/copy'

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

const TweetRow = ({ message }: { message: Message }) => {
  const { msg, roomId, timestamp } = message
  return (
    <StyledTweetRow onClick={() => copy(roomId)}>
      <IDText>{roomId}</IDText>
      <ResponsiveText>{msg}</ResponsiveText>
      <ElapsedTime timestamp={timestamp} />
    </StyledTweetRow>
  )
}

export default TweetRow
