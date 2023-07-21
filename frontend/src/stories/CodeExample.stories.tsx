import type { Meta, StoryObj } from '@storybook/react'

// import * as stores from 'stores'
// import { createMock } from 'storybook-addon-module-mock'
import { CodeExamples } from 'components/Visual/FAQModal/CodeExample'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'VisualArea/FAQ/CodeExample',
  component: CodeExamples,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  args: {
    initialIndexes: [0],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '920px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeExamples>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {}
