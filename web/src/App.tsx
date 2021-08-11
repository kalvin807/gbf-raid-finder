import React from 'react'
import styled from 'styled-components/macro'

import Boards from 'components/Boards'
import Header from 'components/Header'
import ReloadPrompt from 'components/ReloadPrompt'
import SelectRaid from 'components/SelectRaid'
import ThemedBackground from 'components/ThemedBackground'

const App = () => {
  return (
    <>
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <ThemedBackground />
          <Boards />
        </BodyWrapper>
        <ReloadPrompt />
      </AppWrapper>
      <SelectRaid />
    </>
  )
}

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 70px;
  align-items: center;
  flex: 1;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 16px;
    padding-top: 16px;
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
`

export default App
