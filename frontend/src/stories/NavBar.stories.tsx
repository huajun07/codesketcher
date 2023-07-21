import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Meta, StoryObj } from '@storybook/react'
import * as stores from 'stores'
import { createMock } from 'storybook-addon-module-mock'

import { NavBar } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'NavBar',
  component: NavBar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <GoogleOAuthProvider clientId="dummy">
        <Story />
      </GoogleOAuthProvider>
    ),
  ],
} satisfies Meta<typeof NavBar>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const LoggedOut: Story = {}

export const LoggedIn: Story = {
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useUserDataStore')
        mock.mockImplementation(
          stores.createUserStore({
            loggedIn: true,
            name: 'User',
            picture: 'https://lordicon.com/icons/wired/flat/268-avatar-man.svg',
          }),
        )
        return [mock]
      },
    },
  },
}
