import type { Meta, StoryObj } from '@storybook/react'

import { ArrayVisualization } from 'components/Visual/ArrayVisualization'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'VisualArea/ArrayVisualization',
  component: ArrayVisualization,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  argTypes: {},
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            height: 300,
            width: 400,
          }}
        >
          <Story />
        </div>
      )
    },
  ],
} satisfies Meta<typeof ArrayVisualization>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {}
