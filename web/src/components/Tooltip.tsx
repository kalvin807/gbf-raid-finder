import React, { PropsWithChildren } from 'react'
import { transparentize } from 'polished'
import styled from 'styled-components/macro'

const ToolTipWrapper = styled('div')`
  display: inline-block;
  position: relative;
  &:hover div {
    visibility: visible;
  }
`
const ToolTipText = styled('div')`
  visibility: hidden;
  position: absolute;
  border-radius: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px;
  font-size: 0.8rem;
  line-height: 1;
  z-index: 100;
  white-space: nowrap;
  bottom: -30px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => transparentize(0.1, theme.bg0)};
  border: 1px solid ${({ theme }) => theme.bg2};
`

interface Prop {
  content: string
}

const Tooltip = (props: PropsWithChildren<Prop>) => {
  return (
    <ToolTipWrapper>
      {props.children}
      <ToolTipText>{props.content}</ToolTipText>
    </ToolTipWrapper>
  )
}

export default Tooltip
