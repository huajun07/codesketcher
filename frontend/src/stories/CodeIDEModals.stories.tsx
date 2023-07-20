import type { Meta, StoryObj } from '@storybook/react'

import { CodeIDEModal } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'CodeIDE/Modals',
  component: CodeIDEModal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: {
      options: ['create', 'rename', 'delete', 'save'],
      control: { type: 'select' },
      toggle: { type: 'disabled' },
    },
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
} satisfies Meta<typeof CodeIDEModal>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Create: Story = {
  args: {
    variant: 'create',
  },
}

export const Rename: Story = {
  args: {
    variant: 'rename',
  },
}

export const Delete: Story = {
  args: {
    variant: 'delete',
  },
}

export const Save: Story = {
  args: {
    variant: 'save',
  },
}
