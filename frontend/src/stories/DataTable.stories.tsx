import type { Meta, StoryObj } from '@storybook/react'
import * as stores from 'stores'
import { createMock } from 'storybook-addon-module-mock'

import { DataTable } from 'components'

import * as hooks from '../hooks/useSet'

const storeMock = () => {
  const mock = createMock(stores, 'useExecutionStore')
  mock.mockImplementation(
    stores.createExecutionStore({
      data: [
        { name: 'name', value: 'John' },
        { name: 'age', value: 20 },
        { name: 'classes', value: ['Math', 'CS'] },
      ],
    }),
  )
  return mock
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Execution/DataTable',
  component: DataTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    moduleMock: {
      mock: () => {
        return [storeMock()]
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Basic: Story = {}

export const Pinned: Story = {
  args: {
    playing: false,
    disabled: true,
  },
  parameters: {
    moduleMock: {
      mock: () => {
        const setMock = createMock(hooks, 'useSet')
        setMock.mockReturnValue({
          add: () => {
            return
          },
          delete: () => {
            return
          },
          has: (value) => {
            return value === 'classes'
          },
        })
        return [storeMock(), setMock]
      },
    },
  },
}
