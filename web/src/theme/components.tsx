import styled from 'styled-components'

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`

export const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const HideExtraSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

export const SmallOnly = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

export const ExtraSmallOnly = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
  `};
`

const lightPreset = {
  open: {
    color: 'rgba(39,174,96, 0.8)',
    shadow: 'inset 0px 0px 10px 2px rgba(39,174,96, 0.5), 0px 0px 10px 2px rgba(39,174,96, 0.8)',
  },
  closed: {
    color: 'rgba(253, 64, 64, 0.8)',
    shadow: 'inset 0px 0px 10px 2px rgba(253, 64, 64, 0.5), 0px 0px 10px 2px rgba(253, 64, 64, 0.8)',
  },
  connecting: {
    color: 'rgba(227, 165, 7, 0.8)',
    shadow: 'inset 0px 0px 10px 2px rgba(227, 165, 7, 0.5), 0px 0px 10px 2px rgba(227, 165, 7, 0.8)',
  },
}

export const getGlowPreset = (status: number) => {
  switch (status) {
    case WebSocket.OPEN:
      return lightPreset.open
    case WebSocket.CONNECTING:
      return lightPreset.connecting
    default:
      return lightPreset.closed
  }
}
