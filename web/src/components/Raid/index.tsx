import React from 'react'
import styled from 'styled-components/macro'
import { AutoColumn } from '../Column'
import Boards from './Board'

const RaidBoards = () => {
  return (
    <PageWrapper>
      <Boards />
    </PageWrapper>
  )
}

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

export default RaidBoards
