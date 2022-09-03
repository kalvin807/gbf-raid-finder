import { useTranslation } from 'react-i18next'
import { Text } from 'rebass/styled-components'

import { Raid } from 'atoms/gbfAtom'
import { Board } from 'atoms/wsAtoms'
import { RowFixed } from 'components/Row'

const BoardTitle = ({ board, raid }: { board: Board; raid: Raid[] }) => {
  const { i18n, t } = useTranslation()
  const showRaidOrCount = () => {
    const subscribe = board.subscribe
    if (board.name) {
      return board.name
    } else if (subscribe.length === 0) {
      return `${t('add_raid')} 👉`
    } else if (subscribe.length === 1) {
      return i18n.language === 'en' ? raid[subscribe[0]]?.en : raid[subscribe[0]]?.jp
    } else {
      return `${subscribe.length} ${t('raid_selected')}`
    }
  }

  return (
    <RowFixed>
      <Text fontWeight={500} fontSize={16}>
        {showRaidOrCount()}
      </Text>
    </RowFixed>
  )
}

export default BoardTitle
