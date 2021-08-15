import React from 'react'
import { transparentize } from 'polished'
import styled, { keyframes } from 'styled-components/macro'

import ThemedBackground from './ThemedBackground'

const LoadingScreen = () => {
  return (
    <AppWrapper>
      <BodyWrapper>
        <ThemedBackground />
        <StyledLoader />
      </BodyWrapper>
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  place-items: center;
  flex: 1;
  z-index: 1;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledLoader = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  & {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid ${({ theme }) => theme.text1};
    border-radius: 50%;
    animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ theme }) => transparentize(0.5, theme.primary1)} transparent transparent transparent;
  }
  &:nth-child(1) {
    animation-delay: -0.45s;
  }
  &:nth-child(2) {
    animation-delay: -0.3s;
  }
  & :nth-child(3) {
    animation-delay: -0.15s;
  }
`

export default LoadingScreen
