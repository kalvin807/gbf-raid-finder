import React, { useContext, useRef, useState } from 'react'
import { Moon, Settings, Sun } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { darken } from 'polished'
import { Text } from 'rebass/styled-components'
import styled, { css, ThemeContext } from 'styled-components/macro'

import { maxMessageAtom, themeAtom } from 'atoms/settingsAtom'
import { StyledMenuButton } from 'components/Button'
import NetworkDropdown from 'components/Dropdown'
import { useOnClickOutside } from 'hooks/useOnClickOutside'

import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'

export enum FlyoutAlignment {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const StyledMenuIcon = styled(Settings)`
  padding: 4px;
  path {
    stroke: ${({ theme }) => theme.text1};
  }
  color: ${({ theme }) => theme.text1};
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
  min-width: 25.125rem;
  background-color: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
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
    top: -20rem;
    bottom: unset;
    right: -3.5rem;
    left: unset;
    min-width: 19.125rem;
  `};
`

const FancyButton = styled.button`
  color: ${({ theme }) => theme.text1};
  align-items: center;
  height: 2rem;
  border-radius: 12px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  outline: none;
  background: ${({ theme }) => theme.bg1};
  :hover {
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
`

const Input = styled.input`
  background: ${({ theme }) => theme.bg1};
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme }) => theme.text1};
  text-align: center;
`

const OptionCustom = styled(FancyButton)<{ active?: boolean }>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  min-width: 4rem;
  border: ${({ theme, active }) => active && `1px solid ${theme.primary1}`};
  :hover {
    border: ${({ theme, active }) => active && `1px solid ${darken(0.1, theme.primary1)}`};
  }
  input {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 2rem;
  }
`

export default function SettingsTab() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [open, setOpen] = useState(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(
    node,
    open
      ? () => {
          setOpen(false)
        }
      : undefined
  )

  const [isDarkmode, setDarkmode] = useAtom(themeAtom)
  const [maxMessage, setMaxMessage] = useAtom(maxMessageAtom)
  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={() => setOpen((prev) => !prev)} aria-label="setting menu">
        <StyledMenuIcon />
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={14}>
              <Trans i18nKey="finder_setting" t={t}>
                Finder settings
              </Trans>
            </Text>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans i18nKey="tweet_per_board" t={t}>
                    Tweets per board
                  </Trans>
                </TYPE.black>
              </RowFixed>
              <OptionCustom style={{ width: '10px' }}>
                <Input
                  value={maxMessage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0
                    if (value >= 0) setMaxMessage(value)
                  }}
                />
              </OptionCustom>
            </RowBetween>
            <AutoRow>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans i18nKey="action_when_copy" t={t}>
                    Action when copy
                  </Trans>
                </TYPE.black>
              </RowFixed>
              <NetworkDropdown />
            </AutoRow>
            <Text fontWeight={600} fontSize={14}>
              <Trans i18nKey="interface_setting" t={t}>
                Interface settings
              </Trans>
            </Text>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans i18nKey="show_raid_art" t={t}>
                    Display raid art
                  </Trans>
                </TYPE.black>
              </RowFixed>
              <Toggle id="toggle-expert-mode-button" isActive={false} toggle={() => console.log('WIP!')} />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans i18nKey="theme" t={t}>
                    Theme
                  </Trans>
                </TYPE.black>
              </RowFixed>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={isDarkmode}
                toggle={() => {
                  setDarkmode(!isDarkmode)
                }}
                checked={<Moon size={16} />}
                unchecked={<Sun size={16} />}
              />
            </RowBetween>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
