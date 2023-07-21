import { Flex } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react'

import { VisualArea } from 'components'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'VisualArea/VisualArea',
  component: VisualArea,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Flex style={{ minWidth: '500px', minHeight: '250px' }}>
        <Story />
      </Flex>
    ),
  ],
} satisfies Meta<typeof VisualArea>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {}
