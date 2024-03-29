import React from 'react'
import { lighten, transparentize } from 'polished'
import styled, { useTheme } from 'styled-components/macro'

import { Raid } from 'atoms/gbfAtom'

import { ToggleFn } from './SelectRaidModal'

const InfoCard = styled.button<{ bgColor: string; active?: boolean }>`
  background-color: ${({ bgColor, active }) => (active ? bgColor : transparentize(0.8, bgColor))};
  padding: 1rem;
  outline: none;
  border: 1px solid;
  border-radius: 12px;
  width: 100% !important;
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primary1};
  }
  color: ${({ theme, active }) => (active ? theme.white : theme.text1)};
  border-color: ${({ theme, active }) => (active ? 'transparent' : theme.bg3)};
`

const OptionCard = styled(InfoCard)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`

const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  height: 100%;
`

const OptionCardClickable = styled(OptionCard)<{ bgColor: string; click: string }>`
  margin-top: 0;
  border: ${({ bgColor }) => `1px solid ${lighten(0.2, bgColor)}`};
  &:hover {
    cursor: pointer;
    border: ${({ click }) => (click ? `1px solid ${click}` : ``)};
  }
`

const HeaderText = styled.div`
  text-align: left;
  font-size: 0.8rem;
  font-weight: 400;
`

const SubHeader = styled.div`
  margin-top: 10px;
  font-size: 1rem;
  font-weight: 500;
`

export default function Option({ raid, active, toggle }: { raid: Raid; active: boolean; toggle: ToggleFn }) {
  const { id, element, en, jp } = raid
  const theme = useTheme()
  const colorMap: { [key: string]: string } = {
    fire: theme.fire,
    water: theme.water,
    wind: theme.wind,
    earth: theme.earth,
    light: theme.light,
    dark: theme.dark,
  }

  const color = colorMap[element] || theme.bg5

  return (
    <OptionCardClickable onClick={() => toggle(id)} bgColor={color} active={active} click={color}>
      <OptionCardLeft>
        <HeaderText>
          {en}
          <SubHeader>{jp}</SubHeader>
        </HeaderText>
      </OptionCardLeft>
      {/* <IconWrapper size={size}>
        <img src={icon} alt={'Icon'} />
      </IconWrapper> */}
    </OptionCardClickable>
  )
}
