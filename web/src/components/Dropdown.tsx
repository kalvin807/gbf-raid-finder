import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import styled from 'styled-components'

import { CopyAction, copyActionAtom } from 'atoms/settingsAtom'

const Container = styled.div`
  position: relative;
  z-index: 40;
  margin-left: auto;
`

const StyledSelect = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bg1};
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  padding: 6px 8px;
  line-height: 1.5;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
  text-align: right;
  text-align-last: right;
  option {
    text-align: right;
  }
  font-size: 1rem;
`

const availableOptions = [CopyAction.ONLY_COPY, CopyAction.NEW_TAB, CopyAction.SKYLEAP, CopyAction.MOBAGE]

export default function CopyDropdown() {
  const { t } = useTranslation()
  const node = useRef<HTMLDivElement>(null)
  const [copyAction, setCopyAction] = useAtom(copyActionAtom)
  return (
    <Container ref={node}>
      <StyledSelect value={copyAction} onChange={(e) => setCopyAction(e.currentTarget.value as CopyAction)}>
        {availableOptions.map((v, k) => (
          <option value={v} key={k}>
            {t(v)}
          </option>
        ))}
      </StyledSelect>
    </Container>
  )
}
