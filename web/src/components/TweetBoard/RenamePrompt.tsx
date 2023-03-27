import { X } from 'react-feather'
import { Trans } from 'react-i18next'
import { t } from 'i18next'
import { Text } from 'rebass/styled-components'
import styled from 'styled-components/macro'

import Column, { AutoColumn } from 'components/Column'
import { IconWrapper } from 'components/Icon'
import ModalV2 from 'components/ModalV2'
import Row, { RowBetween, RowFixed } from 'components/Row'
import { SearchInput } from 'components/SelectRaid/SelectRaidFilter'

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`
const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`

const RenamePrompt = ({
  isOpen,
  onDismiss,
  name,
  setName,
}: {
  isOpen: boolean
  onDismiss: () => void
  name: string
  setName: (name: string) => void
}) => {
  return (
    <ModalV2 open={isOpen} onClose={onDismiss}>
      <ContentWrapper>
        <PaddedColumn gap="16px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              <Trans i18nKey="rename" t={t}>
                Rename
              </Trans>
            </Text>
            <RowFixed>
              <IconWrapper marginLeft="1rem" onClick={onDismiss} aria-label="close-modal">
                <X />
              </IconWrapper>
            </RowFixed>
          </RowBetween>
          <Row>
            <SearchInput
              type="text"
              id="rename-input"
              placeholder={'古戦場から逃げるな'}
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Row>
        </PaddedColumn>
      </ContentWrapper>
    </ModalV2>
  )
}
export default RenamePrompt
