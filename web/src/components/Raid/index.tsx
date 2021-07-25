import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'
import { AutoColumn } from '../Column'
import Board from './Board'

const Raid = () => {
  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <Board />
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
    margin-bottom: 80px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`

export default Raid
