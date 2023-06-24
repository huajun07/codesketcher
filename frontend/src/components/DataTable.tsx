import 'react-data-grid/lib/styles.css'

import { useState } from 'react'
import DataGrid from 'react-data-grid'
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai'
import { IoFilter } from 'react-icons/io5'
import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useExecutionStore } from 'stores'

import { useSet } from 'hooks/useSet'
import { parsedVariable } from 'utils/executor'

import styles from './DataTable.module.css'

const columns: React.ComponentProps<typeof DataGrid>['columns'] = [
  {
    key: 'pin',
    name: '',
    frozen: true,
    width: 36,
    minWidth: 36,
    cellClass: styles.datagridPinCell,
    headerCellClass: styles.datagridPinHeader,
  },
  { key: 'name', name: 'Name', resizable: true, frozen: true },
  { key: 'value', name: 'Value', resizable: true },
]

interface RowDataProps {
  val: parsedVariable
}

const RowData = (props: RowDataProps) => {
  return <Text>{JSON.stringify(props.val)}</Text>
}

interface RowPinProps {
  isPinned: boolean
  toggle: () => void
}

const RowPin = (props: RowPinProps) => {
  const { isPinned, toggle } = props
  return (
    <Icon
      as={isPinned ? AiFillPushpin : AiOutlinePushpin}
      onClick={toggle}
      border={0}
      h="full"
      w="full"
      p={2}
      color={isPinned ? 'blue.400' : 'blackAlpha.400'}
      _hover={isPinned ? {} : { color: 'blue.400' }}
    />
  )
}

export const DataTable = () => {
  const data = useExecutionStore((state) => state.data)
  const [filterVal, setFilterVal] = useState('')
  const pinned = useSet<string>()
  const togglePinned = (name: string) => {
    if (pinned.has(name)) pinned.delete(name)
    else pinned.add(name)
  }
  const rows = data.map((v) => {
    return {
      pin: (
        <RowPin
          isPinned={pinned.has(v.name)}
          toggle={() => togglePinned(v.name)}
        />
      ),
      name: v.name,
      value: <RowData val={v.value} />,
    }
  })

  rows.sort((a, b) => {
    if (pinned.has(a.name) && !pinned.has(b.name)) return -1
    if (!pinned.has(a.name) && pinned.has(b.name)) return 1
    return 0
  })

  return (
    <Box>
      <Flex flexDirection="column">
        <Box flex={1}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <IoFilter color="gray.300" />
            </InputLeftElement>
            <Input
              border="none"
              _focusVisible={{ border: 'none' }}
              value={filterVal}
              placeholder="Filter variable names"
              onChange={(e) => setFilterVal(e.target.value)}
            />
          </InputGroup>
        </Box>
        <Box flex={1}>
          <DataGrid
            className={useColorModeValue('rdg-light', 'rdg-dark')}
            columns={columns}
            rows={rows.filter((row) => row.name.startsWith(filterVal))}
            style={{ blockSize: 'auto', height: 'calc(40vh)' }}
          />
        </Box>
      </Flex>
    </Box>
  )
}
