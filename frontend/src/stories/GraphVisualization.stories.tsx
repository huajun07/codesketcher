import type { Meta, StoryObj } from '@storybook/react'
import { createMock } from 'storybook-addon-module-mock'

import { GraphVisualization } from 'components'

import * as GraphSettings from '../components/Visual/GraphVisualization/GraphSettingsModal'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'VisualArea/GraphVisualization',
  component: GraphVisualization,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  argTypes: {
    selected: { control: 'boolean' },
  },
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
} satisfies Meta<typeof GraphVisualization>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {
  args: {
    selected: false,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(GraphSettings, 'GraphSettingsModal')
        mock.mockReturnValue(<div></div>)
        return [mock]
      },
    },
  },
}
