import React from 'react'
import styled from 'styled-components/macro'
import { darken } from 'polished'
import { Moon, Sun, Search as SearchIcon } from 'react-feather'
import useScrollPosition from '@react-hook/window-scroll'

import { ButtonSecondary } from './Button'
import Row, { RowFixed, RowBetween } from './Row'
import Menu from './Menu'
import { TYPE } from '../theme'
import SelectRaid from './SelectRaid'
import { useConfig } from '../hooks/useConfig'

const Header = () => {
  const { state, dispatch } = useConfig()
  const scrollY = useScrollPosition()

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <HideMedium>
        <HeaderRow>
          <Title>
            <UniIcon>
              <RowBetween>
                <StyledIcon />
                <TYPE.mediumHeader pl="0.75rem">GBF Raid Finder</TYPE.mediumHeader>
              </RowBetween>
            </UniIcon>
          </Title>
        </HeaderRow>
      </HideMedium>
      <HeaderControls>
        <HeaderElement>
          <AccountElement active={false} style={{ pointerEvents: 'auto' }}>
            <SelectRaid />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <StyledMenuButton onClick={() => dispatch({ ...state, darkMode: !state.darkMode })}>
            {state.darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 21;
  position: relative;

  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`}
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position .1s, box-shadow .1s;


  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0rem;
    grid-template-columns: 120px 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0rem;
  `}
`
const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`
const HeaderLinks = styled(Row)`
  justify-self: center;
  width: fit-content;
  padding: 4px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: flex-end;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const StyledIcon = styled(SearchIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.bg0};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg2};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const TabGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const Web3StatusConnect = styled(TabGeneric)`
  font-weight: 500;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};

  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
    color: ${({ theme }) => darken(0.05, theme.primaryText1)};
  }
`
const Web3StatusConnected = styled(TabGeneric)`
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  font-weight: 500;
`

const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

export default Header
