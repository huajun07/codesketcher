import type { Meta, StoryObj } from '@storybook/react'
import * as stores from 'stores'
import { createMock } from 'storybook-addon-module-mock'

import { IO } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'IO',
  component: IO,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    output: { control: 'string' },
    index: { control: 'number' },
    editing: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '500px', minHeight: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IO>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Input: Story = {
  args: {
    output: '',
    index: 0,
    editing: true,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useUserDataStore')
        mock.mockImplementation(
          stores.createUserStore({
            input: 'Hello World',
          }),
        )
        return [mock]
      },
    },
  },
}

export const ChangedInput: Story = {
  args: {
    output: '',
    index: 0,
    editing: true,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useUserDataStore')
        mock.mockImplementation(
          stores.createUserStore({
            input: 'Hello World',
            loggedIn: true,
            curFile: { code: '', input: '' },
          }),
        )
        return [mock]
      },
    },
  },
}

export const DisabledInput: Story = {
  args: {
    output: '',
    index: 0,
    editing: false,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useUserDataStore')
        mock.mockImplementation(
          stores.createUserStore({
            input: 'Hello World',
          }),
        )
        return [mock]
      },
    },
  },
}

export const Output: Story = {
  args: {
    output: 'Test Output',
    index: 1,
    editing: true,
  },
}
