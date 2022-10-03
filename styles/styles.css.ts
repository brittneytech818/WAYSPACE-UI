import { style, keyframes } from '@vanilla-extract/css'
import { vars, atoms } from '@zoralabs/zord'

export const MAXWIDTH = 700
const maxWidthQuery = `(max-width: ${MAXWIDTH}px)`
const orange = "#f09220"

const waiting = keyframes({
  '0%': { opacity: 1 },
  '30%': { opacity: 0.2 },
  '60%': { opacity: 1 },
})

export const waitingApproval = style({
  opacity: '1 !important',
  selectors: {
    '&:after': {
      content: '•',
      fontSize: '20px',
      color: '#F5A623',
      animation: `1s ${waiting} infinite ease-in-out`,
    },
  },
})

export const hideMobile = style({
  '@media': {
    '(max-width: 500px)': {
      display: 'none',
    },
  },
  fontFamily: 'raleway-medium'
})

export const menuItem = style([
  {
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    gap: 0,
    backgroundColor: "#f09220"
  },
  atoms({
    px: 'x6',
    py: 'x3',
  }),
])


export const mintCounterInput = style([
  {
    width: '3em',
    minWidth: 0,
    outline: 0,
    color: orange,
    selectors: {
      '&:focus': {
        borderColor: vars.color.border.secondary,
      },
      '&:hover:not(:focus)': {
        borderColor: orange,
      },
    },
  },
  atoms({
    color: 'primary',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderRadius: 'small',
    borderWidth: 'normal',
    borderStyle: 'solid',
    textAlign: 'center',
    height: 'x11',
  }),
])

export const priceDateHeading = style({
  fontWeight: 600,
  fontSize: '38px',
  lineHeight: '42px',
  letterSpacing: '0.01em',
  color: '#f09220'
})

export const maxWidth = style({
  margin: '0 auto',
  width: MAXWIDTH,
  '@media': {
    [maxWidthQuery]: {
      maxWidth: MAXWIDTH,
      width: 'auto',
    },
  },
})

export const border = style({
  border: '1px solid #f09220',
  borderRadius: 0,
})

export const heroImage = style({
  objectFit: 'contain',
  height: '100%',
  width: '100%',
  maxHeight: '80vh',
})

export const orangeHeader = style({
  fontFamily: 'cartoon-slam',
  color: orange
})

export const orangeText = style({
  fontFamily: 'raleway-medium',
  color: orange
})
