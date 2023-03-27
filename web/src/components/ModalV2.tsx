import React, { PropsWithChildren } from 'react'
import { isMobile } from 'react-device-detect'
import * as Dialog from '@radix-ui/react-dialog'
import { DialogContentProps } from '@radix-ui/react-dialog'
import { animated, useTransition } from '@react-spring/web'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

interface ModalProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
  minHeight?: number | false
  maxHeight?: number
}

interface StyledDialogContentProps extends DialogContentProps {
  mobile: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InnerDialogContent = React.forwardRef<HTMLDivElement, StyledDialogContentProps>(({ mobile, ...rest }, ref) => (
  <Dialog.DialogContent ref={ref} {...rest} />
))

InnerDialogContent.displayName = 'StyledDialogContent'

const StyledDialogContent = styled(InnerDialogContent)<StyledDialogContentProps>`
  z-index: 101;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: none !important;
  height: 100%;
  width: 100%;
  place-items: center;
  place-content: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContentContainer = styled(({ minHeight, maxHeight, mobile, ...rest }) => <animated.div {...rest} />)`
  display: flex;
  margin: 0 0 2rem 0;
  background-color: ${({ theme }) => theme.bg0};
  border: 1px solid ${({ theme }) => theme.bg1};
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
  padding: 0px;
  width: 70vw;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 720px;
  pointer-events: auto;

  ${({ maxHeight }) =>
    maxHeight &&
    css`
      max-height: ${maxHeight}vh;
    `}
  ${({ minHeight }) =>
    minHeight &&
    css`
      min-height: ${minHeight}vh;
    `}
  border-radius: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width:  100vw;
    margin: 0;
  `}
  ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
    width:  100vw;
    border-radius: 20px;
    ${
      mobile &&
      css`
        width: 100vw;
        border-radius: 20px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      `
    }
  `}
`

const Modal: React.FC<ModalProps> = ({ open, onClose, children, minHeight, maxHeight }) => {
  const fadeTransition = useTransition(
    open,
    isMobile
      ? {
          from: { transform: 'translateY(100%)' },
          enter: { transform: 'translateY(0)' },
          leave: { transform: 'translateY(100%)' },
          config: { tension: 180, friction: 20 },
        }
      : {
          config: { duration: 128 },
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: { opacity: 0 },
        }
  )

  return (
    <>
      {fadeTransition(
        (props, item) =>
          item && (
            <Dialog.Root open={open}>
              <Dialog.Portal>
                <Dialog.Overlay />
                <StyledDialogContent
                  onInteractOutside={() => {
                    onClose()
                  }}
                  onEscapeKeyDown={() => onClose()}
                  mobile={isMobile}
                >
                  <StyledDialogContentContainer
                    style={props}
                    minHeight={minHeight}
                    maxHeight={maxHeight}
                    mobile={isMobile}
                  >
                    {children}
                  </StyledDialogContentContainer>
                </StyledDialogContent>
              </Dialog.Portal>
            </Dialog.Root>
          )
      )}
    </>
  )
}

export default Modal
