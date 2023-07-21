import type { Meta, StoryObj } from '@storybook/react'

import {
  EdgeFormat,
  GraphSettingsModal,
} from '../components/Visual/GraphVisualization/GraphSettingsModal'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'VisualArea/GraphVisualization/GraphSettingsModal',
  component: GraphSettingsModal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  args: {
    open: true,
    settings: {
      directed: true,
      weighted: false,
      edgeFormat: EdgeFormat.AdjacencyList,
      edgesVariableName: 'adjList',
      displayVariableNames: ['dist'],
    },
  },
} satisfies Meta<typeof GraphSettingsModal>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {}
