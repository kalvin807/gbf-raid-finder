import React, { useState } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween } from '../Row'
import { ChevronDown, ChevronUp } from 'react-feather'
import { LightCard } from '../Card'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.bg2};
  }

  background-color: ${({ theme, disable }) => disable && theme.bg3};
  opacity: ${({ disable }) => disable && '0.4'};
`

export default function SelectRaidFilter() {
  const [expand, setExpand] = useState(false)
  const bases = ['★8 Rapture', '★7 Dragon']
  return (
    <LightCard width="100%" padding="8px">
      <AutoColumn gap="sm" justify="center">
        <RowBetween padding="8px" onClick={() => setExpand(!expand)}>
          <Text fontWeight={500} fontSize={16}>
            Filter
          </Text>
          {expand ? <ChevronUp /> : <ChevronDown />}
        </RowBetween>
        {expand ? (
          <AutoRow gap="4px">
            <SearchInput
              type="text"
              id="token-search-input"
              placeholder="Search name or paste address"
              autoComplete="off"
              // value={searchQuery}
              // ref={inputRef as RefObject<HTMLInputElement>}
              // onChange={handleInput}
              // onKeyDown={handleEnter}
            />
            <AutoRow>
              <Text fontWeight={500} fontSize={14}>
                Categories
              </Text>
            </AutoRow>
            <AutoRow gap="4px">
              {bases.map((cata) => {
                return (
                  <BaseWrapper disable={false} key={1}>
                    <Text fontWeight={500} fontSize={16}>
                      {cata}
                    </Text>
                  </BaseWrapper>
                )
              })}
            </AutoRow>
          </AutoRow>
        ) : null}
      </AutoColumn>
    </LightCard>
  )
}

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
