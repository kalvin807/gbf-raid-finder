import React, { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Code, Moon, MoreHorizontal as MenuIcon, Sun } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import styled, { css } from 'styled-components/macro'

import { themeAtom } from 'atoms/settingsAtom'
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from 'statics/constant'

import { useOnClickOutside } from '../hooks/useOnClickOutside'

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
  height: 38px;
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg1};
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    border: 1px solid ${({ theme }) => theme.bg3};
    transform: scale(0.99);
  }
  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span<{ flyoutAlignment?: FlyoutAlignment }>`
  min-width: 196px;
  max-height: 350px;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border: 1px solid ${({ theme }) => theme.bg0};
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 16px;
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
    top: -12rem;
    bottom: unset;
    right: 0;
    left: unset;
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
  justify-content: space-between;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const InternalMenuItem = styled(StyledLink)`
  flex: 1;
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

const InternalLinkMenuItem = styled(InternalMenuItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  text-decoration: none;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const ToggleMenuItem = styled.button`
  background-color: transparent;
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const CODE_LINK = 'https://github.com/kalvin807/gbf-raid-finder'

function LanguageMenuItem({
  locale,
  active,
  onClick,
}: {
  locale: SupportedLocale
  active: boolean
  onClick: () => Promise<any>
}) {
  return (
    <InternalLinkMenuItem onClick={onClick}>
      <div>{LOCALE_LABEL[locale]}</div>
      {active && <Check opacity={0.6} size={16} />}
    </InternalLinkMenuItem>
  )
}

function LanguageMenu({ close }: { close: () => void }) {
  const { i18n } = useTranslation()

  return (
    <MenuFlyout>
      <ToggleMenuItem onClick={close}>
        <ChevronLeft size={16} />
      </ToggleMenuItem>
      {SUPPORTED_LOCALES.map((locale) => (
        <LanguageMenuItem
          locale={locale}
          active={locale === i18n.language}
          key={locale}
          onClick={() => i18n.changeLanguage(locale)}
        />
      ))}
    </MenuFlyout>
  )
}

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, setOpen] = React.useState(false)
  const [isDarkMode, setDarkMode] = useAtom(themeAtom)
  useOnClickOutside(
    node,
    open
      ? () => {
          setOpen(false)
        }
      : undefined
  )
  const { t } = useTranslation()

  const [menu, setMenu] = useState<'main' | 'lang' | 'settings'>('main')

  useEffect(() => {
    setMenu('main')
  }, [open])

  const toggleMenu = () => (open ? setOpen(false) : setOpen(true))
  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggleMenu} aria-label="menu">
        <StyledMenuIcon />
      </StyledMenuButton>

      {open &&
        (() => {
          switch (menu) {
            case 'lang':
              return <LanguageMenu close={() => setMenu('main')} />
            case 'main':
            default:
              return (
                <MenuFlyout>
                  <MenuItem href={CODE_LINK}>
                    <div>
                      <Trans i18nKey="code" t={t}>
                        Code
                      </Trans>
                    </div>
                    <Code opacity={0.6} size={16} />
                  </MenuItem>
                  <ToggleMenuItem onClick={() => setMenu('lang')}>
                    <div>
                      <Trans i18nKey="language" t={t}>
                        Language
                      </Trans>
                    </div>
                    <ChevronRight size={16} opacity={0.6} />
                  </ToggleMenuItem>
                  {/* <ToggleMenuItem onClick={() => setMenu('lang')}>
                    <div>
                      <Trans i18nKey="setting" t={t}>
                        Setting
                      </Trans>
                    </div>
                    <ChevronRight size={16} opacity={0.6} />
                  </ToggleMenuItem> */}
                  <ToggleMenuItem onClick={() => setDarkMode((prev) => !prev)}>
                    <div>{isDarkMode ? t('light_theme') : t('dark_theme')}</div>
                    {isDarkMode ? <Moon opacity={0.6} size={16} /> : <Sun opacity={0.6} size={16} />}
                  </ToggleMenuItem>
                </MenuFlyout>
              )
          }
        })()}
    </StyledMenu>
  )
}
