import { Raid } from 'atoms/gbfAtom'
import { updateBoardAtom } from 'atoms/wsAtoms'
import { PrimitiveAtom, useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { transparentize } from 'polished'
import React, { useCallback } from 'react'
import styled, { useTheme } from 'styled-components'

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

const OptionCardClickable = styled(OptionCard)<{ click: string }>`
  margin-top: 0;
  border: ${({ theme }) => `2px solid ${theme.bg1}`};
  &:hover {
    cursor: pointer;
    border: ${({ click }) => (click ? `2px solid ${click}` : ``)};
  }
`

const HeaderText = styled.div`
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
`

const SubHeader = styled.div`
  margin-top: 10px;
  font-size: 12px;
`

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? `${size}px` : '24px')};
    width: ${({ size }) => (size ? `${size}px` : '24px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

export default function Option({ atom }: { atom: PrimitiveAtom<Raid> }) {
  const [item, setItem] = useAtom(atom)
  const { isSelected, element, en, jp } = item
  const updateBoard = useUpdateAtom(updateBoardAtom)
  const theme = useTheme()
  const colorMap: { [key: string]: string } = {
    Fire: theme.fire,
    Water: theme.water,
    Wind: theme.wind,
    Earth: theme.earth,
    Light: theme.light,
    Dark: theme.dark,
  }

  const toggleSelected = useCallback(() => {
    // eslint-disable-next-line react/prop-types
    setItem((props) => ({ ...props, isSelected: !isSelected }))
    updateBoard({ raid: item, action: isSelected ? 'remove' : 'add' })
  }, [setItem, updateBoard, item, isSelected])

  const color = colorMap[element] || theme.bg5

  return (
    <OptionCardClickable onClick={toggleSelected} bgColor={color} active={isSelected} click={color}>
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
