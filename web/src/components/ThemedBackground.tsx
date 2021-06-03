import styled from 'styled-components/macro'

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
  background: ${({ backgroundColor }) =>
    `radial-gradient(50% 50% at 50% 50%, ${
      backgroundColor ? backgroundColor : '#fc077d10'
    } 0%, rgba(255, 255, 255, 0) 100%)`};
  transform: translateY(-100vh);
  will-change: background;
  transition: background 450ms ease;
`

export default ThemedBackground
