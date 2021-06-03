import React from 'react'
import styled from 'styled-components/macro'
import { TYPE } from 'theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { StyledLink } from '../../theme'
import Agni from '../../assets/images/raids/Agni_ExtremePlus.jpg'
import { Type } from 'react-feather'

const CTASection = styled.section`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  gap: 8px;
`

const ClickableCard = styled(StyledLink)`
  background-size: 40px 40px;
  background-color: ${({ theme }) => theme.bg2};
  padding: 24px;
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 8px;
  justify-content: space-between;
  position: relative;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg3};
  * {
    color: ${({ theme }) => theme.text1};
    text-decoration: none !important;
  }
  :hover {
    border: 1px solid ${({ theme }) => theme.bg5};
    background-color: ${({ theme }) => theme.bg2};
    text-decoration: none;
    * {
      text-decoration: none !important;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 135px auto auto;
   padding: 1rem;
   gap: 4px;
  `};
`

const HeaderText = styled(TYPE.main)`
  align-items: center;
  display: flex;
  font-size: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 16px;
  `};
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

const ResponsiveColumn = styled(AutoColumn)`
  grid-template-columns: 1fr;
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    gap: 4px;
  `};
  justify-content: space-between;
`

const StyledImage = styled.img`
  place-self: end;
  height: 100px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 75px;
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
const TwitterCard = () => {
  return (
    <ClickableCard>
      <ResponsiveColumn>
        <HeaderText fontWeight={300}>{'Lv150 フロネシス'}</HeaderText>
        <HeaderText fontWeight={300}>{'Lvl 150 Phronesis'}</HeaderText>
        <IDText>{'2A3A61ED'}</IDText>
      </ResponsiveColumn>
      <ResponsiveText fontWeight={300}>{'As we have discussed in the first tutorial'}</ResponsiveText>
      <ResponsiveColumn style={{ placeItems: 'center' }}>
        <StyledImage src={Agni} />
        <TYPE.small>{'59s'}</TYPE.small>
      </ResponsiveColumn>
    </ClickableCard>
  )
}

export default function CTACards() {
  return <CTASection>{Array(10).fill(<TwitterCard key="1" />)}</CTASection>
}
