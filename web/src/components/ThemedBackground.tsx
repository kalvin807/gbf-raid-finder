import styled from 'styled-components'

const ThemedBackground = styled.div<{ backgroundColor?: string | undefined }>`
  position: fixed;
  top: 0;
  left: calc(-100vw / 2);
  right: 0;
  pointer-events: none;
  /* max-width: 100vw !important; */
  width: 200vw;
  height: 200vh;
  mix-blend-mode: color;
  background: ${({ backgroundColor, theme }) => backgroundColor || theme.bg0};
  transform: translateY(-100vh);
  will-change: background;
  -webkit-transition: background 200ms ease-out;
  -ms-transition: background 200ms ease-out;
  transition: background 200ms ease-out;
`

export default ThemedBackground

// dark sky blue color : #fc077d10
