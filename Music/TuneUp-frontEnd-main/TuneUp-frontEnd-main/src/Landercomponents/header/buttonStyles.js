import { css } from "@emotion/react"

export const buttonStyles = css`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.6s;
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(2px);
  }
`

export const loginButtonStyles = css`
  ${buttonStyles}
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
`

export const signupButtonStyles = css`
  ${buttonStyles}
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
`

