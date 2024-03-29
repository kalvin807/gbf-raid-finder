import React, { useCallback } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'
import { PrimitiveAtom, useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { Text } from 'rebass/styled-components'
import styled from 'styled-components/macro'

import { Category, categoryAtom } from 'atoms/gbfAtom'
import useToggle from 'hooks/useToggle'

import { LightCard } from '../Card'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween } from '../Row'

interface FilterProps {
  categoryFilterAtom: PrimitiveAtom<string[]>
  nameFilterAtom: PrimitiveAtom<string>
}

const CategoryButton = ({
  id,
  value,
  active,
  toggle,
}: {
  id: string
  value: Category
  active: boolean
  toggle: (id: string) => void
}) => {
  const { i18n } = useTranslation()
  return (
    <BaseWrapper active={active} onClick={() => toggle(id)}>
      <Text fontWeight={500} fontSize={16}>
        {i18n.language === 'en' ? value.en : value.ja}
      </Text>
    </BaseWrapper>
  )
}

const CategoriesFilter = ({ atom }: { atom: PrimitiveAtom<string[]> }) => {
  const category = useAtomValue(categoryAtom)
  const [active, setActive] = useAtom(atom)
  const toggleActive = useCallback(
    (id: string) => setActive((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])),
    [setActive]
  )
  return (
    <CategoryScroll gap="4px">
      {Object.entries(category).map(([key, value]) => {
        return <CategoryButton id={key} key={key} value={value} toggle={toggleActive} active={active.includes(key)} />
      })}
    </CategoryScroll>
  )
}

const ExpandedFilter = ({ categoryFilterAtom, nameFilterAtom }: FilterProps) => {
  const [value, setValue] = useAtom(nameFilterAtom)
  const { t } = useTranslation()
  return (
    <AutoRow gap="4px">
      <SearchInput
        type="text"
        id="token-search-input"
        placeholder={t('search_placeholder')}
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          <Trans t={t} i18nKey="categories">
            Categories
          </Trans>
        </Text>
      </AutoRow>
      <CategoriesFilter atom={categoryFilterAtom} />
    </AutoRow>
  )
}

export default function SelectRaidFilter(props: FilterProps) {
  const [expand, toggle] = useToggle(false)
  const { t } = useTranslation()
  return (
    <LightCard width="100%" padding="8px">
      <AutoColumn gap="sm" justify="center">
        <RowBetween padding="8px" onClick={toggle} aria-label="toggle-filter">
          <Text fontWeight={500} fontSize={16}>
            <Trans t={t} i18nKey="filter">
              Filter
            </Trans>
          </Text>
          {expand ? <ChevronUp /> : <ChevronDown />}
        </RowBetween>
        {expand ? <ExpandedFilter {...props} /> : null}
      </AutoColumn>
    </LightCard>
  )
}

const BaseWrapper = styled.div<{ active?: boolean }>`
  border: 1px solid ${({ theme, active }) => (active ? 'transparent' : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;
  cursor: pointer;

  align-items: center;
  :hover {
    background-color: ${({ theme, active }) => !active && theme.bg2};
  }
  color: ${({ theme, active }) => (active ? theme.white : theme.text1)};
  background-color: ${({ theme, active }) => active && theme.primary1};
`

const CategoryScroll = styled(AutoRow)`
  max-height: 128px;
  overflow-y: auto;
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
