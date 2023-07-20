import type { Meta, StoryObj } from '@storybook/react'
import * as stores from 'stores'
import { createMock } from 'storybook-addon-module-mock'

import { CodeIDE } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'CodeIDE/Main',
  component: CodeIDE,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useUserDataStore')
        mock.mockImplementation(
          stores.createUserStore({
            code: "print('hello world!')\na = 0",
          }),
        )
        return [mock]
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    editable: { control: 'boolean' },
    lineHighlight: { control: 'number' },
  },
} satisfies Meta<typeof CodeIDE>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {
  args: {
    editable: true,
    lineHighlight: 1,
  },
}

export const Disabled: Story = {
  args: {
    editable: false,
    lineHighlight: 1,
  },
}
