import React, { useCallback } from 'react'
import { Search as SearchIcon } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'
import useScrollPosition from '@react-hook/window-scroll'
import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { darken } from 'polished'
import { WorkerRequest } from 'services/worker.type'
import styled from 'styled-components/macro'

import { modalAtom } from 'atoms/settingsAtom'
import { wsStateAtom } from 'atoms/wsAtoms'
import LuriaImgPath from 'statics/images/luria.png'

import { getGlowPreset } from '../theme'

import { ButtonErrorStyle, ButtonSecondary } from './Button'
import { worker } from './DataStore'
import Menu from './Menu'
import { RowBetween, RowFixed } from './Row'
import Setting from './Setting'

const WebsocketStatus = () => {
  const [wsStatus, setStatus] = useAtom(wsStateAtom)
  const colorPreset = getGlowPreset(wsStatus)
  const { t } = useTranslation()
  const reconnect = useCallback(() => {
    worker.postMessage({ type: 'start' } as WorkerRequest)
    setStatus(WebSocket.CONNECTING)
  }, [setStatus])

  return (
    <>
      {wsStatus === WebSocket.CLOSED && (
        <ButtonErrorStyle onClick={reconnect}>
          <Trans i18nKey="reconnect" t={t}>
            Reconnect
          </Trans>
        </ButtonErrorStyle>
      )}
      <Dot color={colorPreset.color} shadow={colorPreset.shadow} />
    </>
  )
}

const Header = () => {
  const scrollY = useScrollPosition()
  const setModal = useUpdateAtom(modalAtom)
  const { t } = useTranslation()
  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <HideMedium>
        <HeaderRow>
          <Title>
            <WebIcon>
              <RowBetween>
                <Luria>
                  <LuriaImg width={'32px'} src={LuriaImgPath} alt="logo" />
                </Luria>
              </RowBetween>
            </WebIcon>
          </Title>
        </HeaderRow>
      </HideMedium>
      <HeaderControls>
        <HeaderElement>
          <SelectRaid active={false} style={{ pointerEvents: 'auto' }}>
            <SelectRaidButton onClick={() => setModal(true)}>
              <Trans i18nKey="add_raid" t={t}>
                Add Raid
              </Trans>
            </SelectRaidButton>
          </SelectRaid>
        </HeaderElement>
        <HeaderElementWrap>
          <WebsocketStatus />
          <Setting />
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
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;

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
    box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.bg2};
    background-color: ${({ theme }) => theme.bg1};
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
  gap: 4px;
`

const WebIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const LuriaImg = styled.img`
  width: 32px;
  fit: contain;
  border-radius: 100%;
`

const Luria = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const SelectRaid = styled.div<{ active: boolean }>`
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

const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
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

const SelectRaidButton = styled(TabGeneric)`
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

const Dot = styled.div<{ color: string; shadow: string }>`
  padding: 4px;
  margin: 8px;
  border-radius: 100%;
  background: ${({ color }) => color};
  box-shadow: ${({ shadow }) => shadow};
`
export default Header
