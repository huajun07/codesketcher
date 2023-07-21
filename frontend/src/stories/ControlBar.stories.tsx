import type { Meta, StoryObj } from '@storybook/react'
import * as stores from 'stores'
import { createMock } from 'storybook-addon-module-mock'

import { ControlBar } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Execution/ControlBar',
  component: ControlBar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    playing: { control: 'boolean' },
    length: { control: 'number' },
    curSpeed: { control: 'number' },
    disabled: { control: 'boolean' },
    wasPlaying: { control: 'boolean' },
  },
  args: {
    length: 10,
    curSpeed: 5,
    wasPlaying: false,
  },
} satisfies Meta<typeof ControlBar>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {
  args: {
    playing: true,
    disabled: false,
  },
}

export const Stopped: Story = {
  args: {
    playing: false,
    disabled: false,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useExecutionStore')
        mock.mockImplementation(
          stores.createExecutionStore({
            currentStep: 5,
          }),
        )
        return [mock]
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    playing: false,
    disabled: true,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(stores, 'useExecutionStore')
        mock.mockImplementation(
          stores.createExecutionStore({
            currentStep: 5,
          }),
        )
        return [mock]
      },
    },
  },
}
