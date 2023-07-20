import type { Meta, StoryObj } from '@storybook/react'
import * as stores from 'stores'
import { createMock } from 'storybook-addon-module-mock'

import { CodeIDEButtons } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'CodeIDE/Buttons',
  component: CodeIDEButtons,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    editing: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeIDEButtons>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Running: Story = {
  args: {
    editing: false,
    isDisabled: false,
  },
}

export const Editing: Story = {
  args: {
    editing: true,
    isDisabled: false,
  },
}

export const Filled: Story = {
  args: {
    editing: true,
    isDisabled: false,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useUserDataStore')
        mock.mockImplementation(
          stores.createUserStore({
            codenames: ['', 'test.py'],
            curIdx: 1,
            loggedIn: true,
            curFile: { code: '', input: '' },
            code: '',
            input: '',
          }),
        )
        return [mock]
      },
    },
  },
}

export const LoadingUser: Story = {
  args: {
    editing: true,
    isDisabled: false,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useUserDataStore')
        mock.mockImplementation(
          stores.createUserStore({
            loading: true,
          }),
        )
        return [mock]
      },
    },
  },
}

export const Unsaved: Story = {
  args: {
    editing: true,
    isDisabled: false,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useUserDataStore')
        mock.mockImplementation(
          stores.createUserStore({
            codenames: ['', 'test.py'],
            curIdx: 1,
            loggedIn: true,
            curFile: { code: 'code', input: '' },
            code: 'code2',
          }),
        )
        return [mock]
      },
    },
  },
}
