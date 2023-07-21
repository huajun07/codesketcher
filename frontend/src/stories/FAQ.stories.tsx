import type { Meta, StoryObj } from '@storybook/react'

import { FAQModal } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'VisualArea/FAQ/Modal',
  component: FAQModal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  argTypes: {
    open: { control: 'boolean' },
  },
  args: {
    open: true,
  },
} satisfies Meta<typeof FAQModal>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {}
