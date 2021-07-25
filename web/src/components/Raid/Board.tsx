import React from 'react'
import styled from 'styled-components/macro'
import { Text } from 'rebass'
import { TYPE } from 'theme'
import Column, { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { StyledLink } from '../../theme'
import { Bell, BellOff, Clipboard, Circle, X } from 'react-feather'
import { Separator } from 'components/SelectRaid/SelectRaidModal'
import { useAtomValue } from 'jotai/utils'
import { boardAtomsAtom, Board as BoardType } from 'atoms/wsAtoms'
import { PrimitiveAtom, useAtom } from 'jotai'

const CTASection = styled.section`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  gap: 8px;
`

const StyledBoard = styled(Column)`
  background-color: ${({ theme }) => theme.bg1};
  display: flex;
  position: relative;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 1rem;
  * {
    color: ${({ theme }) => theme.text1};
    text-decoration: none !important;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    gap: 4px;
  `};
`

const ClickableRow = styled(StyledLink)`
  background-size: 40px 40px;
  display: grid;
  grid-template-columns: auto auto;
  gap: 8px;
  justify-content: space-between;
  position: relative;
  padding: 1rem;
  * {
    color: ${({ theme }) => theme.text1};
    text-decoration: none !important;
  }
  :hover {
    background-color: ${({ theme }) => theme.bg2};
    text-decoration: none;
    * {
      text-decoration: none !important;
    }
  }
`

const HeaderColumn = styled(AutoColumn)`
  padding: 8px;
`

const IDText = styled(TYPE.label)`
  align-items: center;
  display: flex;
  margin-bottom: 24px;
  font-weight: 400;
  font-size: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 20px;
  `};
`
const ResponsiveText = styled(TYPE.main)`
  font-weight: 400;
  align-items: center;
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`
const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const StyledButton = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  padding: 0;
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

const Twitter = () => {
  return (
    <ClickableRow>
      <ResponsiveText>{'As we have discussed in the first tutorial'}</ResponsiveText>
      <IDText>{'2A3A61ED'}</IDText>
    </ClickableRow>
  )
}

const TwitterBoard = ({ atom }: { atom: PrimitiveAtom<BoardType> }) => {
  const [value, setValue] = useAtom(atom)
  const toggleCopy = () => setValue((prev) => ({ ...prev, isAutoCopy: !prev.isAutoCopy }))
  const toggleAlert = () => setValue((prev) => ({ ...prev, isAlert: !prev.isAlert }))
  return (
    <StyledBoard>
      <HeaderColumn gap="16px" justify="center">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            {value.en}
          </Text>
          <HeaderWrap>
            <StyledButton onClick={toggleAlert}>
              {value.isAlert ? <Bell size={20} /> : <BellOff size={20} />}
            </StyledButton>
            <StyledButton onClick={toggleCopy}>
              {value.isAutoCopy ? <Clipboard size={20} /> : <Circle size={20} />}
            </StyledButton>
            <StyledButton
              onClick={() => {
                console.log('hi')
              }}
            >
              <X size={20} />
            </StyledButton>
          </HeaderWrap>
        </RowBetween>
      </HeaderColumn>
      <Separator />
      <Twitter key={1} />
      <Twitter key={1} />
      <Twitter key={1} />
    </StyledBoard>
  )
}

export default function Board() {
  const boards = useAtomValue(boardAtomsAtom)
  return (
    <CTASection>
      {boards.map((board, index) => (
        <TwitterBoard atom={board} key={index} />
      ))}
    </CTASection>
  )
}
