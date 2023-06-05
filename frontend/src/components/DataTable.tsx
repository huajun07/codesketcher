import 'react-data-grid/lib/styles.css'

import { useState } from 'react'
import DataGrid from 'react-data-grid'
import { IoFilter } from 'react-icons/io5'
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

import { parsedVariable } from 'utils/executor'

interface RowDataProps {
  val: parsedVariable
}

const RowData = (props: RowDataProps) => {
  return <Text>{JSON.stringify(props.val)}</Text>
}

interface dataVal {
  name: string
  value: parsedVariable
}

interface dataTableProps {
  data: dataVal[]
}

export const DataTable = (props: dataTableProps) => {
  const [filterVal, setFilterVal] = useState('')
  const columns = [
    { key: 'name', name: 'Name', resizable: true, frozen: true },
    { key: 'value', name: 'Value', resizable: true },
  ]
  const rows = props.data.map((v) => {
    return { name: v.name, value: <RowData val={v.value} /> }
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
