import './global.css'

import type { Preview } from '@storybook/react'

import {theme} from '../src/theme'

export const parameters = {
  chakra: {
    theme,
    portalZIndex: 0
  },
}
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
