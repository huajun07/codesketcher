import type { Meta, StoryObj } from '@storybook/react'

import { CodeShareModal } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'CodeIDE/ShareModal',
  component: CodeShareModal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    open: {
      control: 'boolean',
      toggle: () => {
        return
      },
    },
  },
  args: {
    open: true,
  },
} satisfies Meta<typeof CodeShareModal>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {}
