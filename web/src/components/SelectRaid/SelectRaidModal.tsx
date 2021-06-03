import { useOnClickOutside } from 'hooks/useOnClickOutside'
import React, { useCallback, useEffect, useRef, memo } from 'react'
import Modal from '../Modal'
import styled from 'styled-components/macro'
import Column, { AutoColumn } from '../Column'
import Row, { RowBetween, RowFixed } from '../Row'
import { Text } from 'rebass'
import { CloseIcon, TYPE, ButtonText, IconWrapper } from '../../theme'
import { Edit } from 'react-feather'
import useTheme from 'hooks/useTheme'
import SelectRaidFilter from './SelectRaidFilter'

const ListRow = memo(function ListRow({ jp, en }: { jp: string; en: string }) {
  return (
    <RowWrapper active={false} bgColor={''} key={'3'} id={'3'}>
      <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      <Column style={{ flex: '1' }}>
        <Row>
          <StyledTitleText active={false}>{jp}</StyledTitleText>
        </Row>
        <RowFixed mt="4px">
          <StyledListUrlText active={false} mr="6px">
            {en}
          </StyledListUrlText>
        </RowFixed>
      </Column>
    </RowWrapper>
  )
})

export default function SelectModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const theme = useTheme()
  const sortedLists = [
    { jp: 'fdgdfg', en: '23424' },
    { jp: 'fdgdfg', en: '23424' },
    { jp: 'fdgdfg', en: '23424' },
    { jp: 'fdgdfg', en: '23424' },
    { jp: 'fdgdfg', en: '23424' },
    { jp: 'fdgdfg', en: '23424' },
  ]
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <ContentWrapper>
        <PaddedColumn gap="16px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              Select Raids
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <Row>
            <SelectRaidFilter />
          </Row>
        </PaddedColumn>
        <Separator />
        <ListContainer>
          <AutoColumn gap="md">
            {sortedLists.map((raid, id) => (
              <ListRow key={id} en={raid.en} jp={raid.jp} />
            ))}
          </AutoColumn>
        </ListContainer>
      </ContentWrapper>
    </Modal>
  )
}

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`

export const ModalInfo = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  flex: 1;
  user-select: none;
`
export const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`

export const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.text2};
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
  top: 80px;
`

export const TextDot = styled.div`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.text2};
  border-radius: 50%;
`

export const FadedSpan = styled(RowFixed)`
  color: ${({ theme }) => theme.primary1};
  font-size: 14px;
`
export const Checkbox = styled.input`
  border: 1px solid ${({ theme }) => theme.red3};
  height: 20px;
  margin: 0;
`

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`

export const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.bg2};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

const ListContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow: auto;
  padding-bottom: 80px;
`

const RowWrapper = styled(Row)<{ bgColor: string; active: boolean }>`
  background-color: ${({ bgColor, active, theme }) => (active ? bgColor ?? 'transparent' : theme.bg2)};
  transition: 200ms;
  align-items: center;
  padding: 1rem;
  border-radius: 20px;
`

const StyledTitleText = styled.div<{ active: boolean }>`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`

const StyledListUrlText = styled(TYPE.main)<{ active: boolean }>`
  font-size: 12px;
  color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`
