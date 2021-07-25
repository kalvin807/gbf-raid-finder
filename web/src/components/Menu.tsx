import React, { useRef } from 'react'
import { BookOpen, Code, Info, MessageCircle, PieChart, MoreHorizontal as MenuIcon } from 'react-feather'
import styled, { css } from 'styled-components/macro'
import { useOnClickOutside } from '../hooks/useOnClickOutside'

import { ButtonPrimary } from './Button'

export enum FlyoutAlignment {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
  color: ${({ theme }) => theme.text1};
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg2};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg3};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span<{ flyoutAlignment?: FlyoutAlignment }>`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  z-index: 100;
  ${({ flyoutAlignment = FlyoutAlignment.RIGHT }) =>
    flyoutAlignment === FlyoutAlignment.RIGHT
      ? css`
          right: 0rem;
        `
      : css`
          left: 0rem;
        `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -14rem;
  `};
`

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

const MenuItem = styled(StyledLink)`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

const CODE_LINK = 'https://github.com/Uniswap/uniswap-interface'

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, setOpen] = React.useState(false)
  useOnClickOutside(
    node,
    open
      ? () => {
          setOpen(false)
        }
      : undefined
  )
  const toggleMenu = () => (open ? setOpen(false) : setOpen(true))
  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggleMenu}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem href="https://uniswap.org/">
            <Info size={14} />
            <div>About</div>
          </MenuItem>
          <MenuItem href="https://docs.uniswap.org/">
            <BookOpen size={14} />
            <div>Docs</div>
          </MenuItem>
          <MenuItem href={CODE_LINK}>
            <Code size={14} />
            <div>Code</div>
          </MenuItem>
          <MenuItem href="https://discord.gg/FCfyBSbCU5">
            <MessageCircle size={14} />
            <div>Discord</div>
          </MenuItem>
          <MenuItem href="https://info.uniswap.org/">
            <PieChart size={14} />
            <div>Analytics</div>
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
