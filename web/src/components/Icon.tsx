import styled from 'styled-components'

export const IconWrapper = styled.button<{ stroke?: string; size?: string; marginRight?: string; marginLeft?: string }>`
  background-color: transparent;
  padding: 0;
  border: none;
  width: ${({ size }) => size ?? '24px'};
  height: ${({ size }) => size ?? '24px'};
  margin-right: ${({ marginRight }) => marginRight ?? 0};
  margin-left: ${({ marginLeft }) => marginLeft ?? 0};
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
  :active {
    transform: scale(0.9);
  }
  :focus {
    cursor: pointer;
    outline: none;
    opacity: 0.7;
  }
`
