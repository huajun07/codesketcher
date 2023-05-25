import 'react-data-grid/lib/styles.css'

import DataGrid from 'react-data-grid'
import { Box } from '@chakra-ui/react'

interface dataVal {
  name: string
  value: string | number
}

interface dataTableProps {
  data: dataVal[]
}

export const DataTable = (props: dataTableProps) => {
  const columns = [
    { key: 'name', name: 'Name', resizable: true, frozen: true },
    { key: 'value', name: 'Value', resizable: true },
  ]
  return (
    <Box height="450px" overflowY="scroll">
      <DataGrid columns={columns} rows={props.data} />
    </Box>
  )
}
