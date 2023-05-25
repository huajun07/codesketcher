import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'

import { CodeIDE, CodeIDEButtons } from 'components'
import { DataTable } from 'components/DataTable'

export const Main = () => {
  const [editing, setEditing] = useState(true)
  const test = [
    { name: 'a', value: 2 },
    { name: 'b', value: 'hellow world' },
    { name: 'c', value: 3.02 },
  ]
  return (
    <>
      <Flex>
        <Box w="500px" overflowX="scroll" borderRightWidth="1px">
          <CodeIDEButtons
            editing={editing}
            toggleMode={() => setEditing(!editing)}
          />
          <CodeIDE editable={editing} lineHighlight={2} />
        </Box>
        <Box w="500px" overflowX="scroll" borderRightWidth="1px">
          <DataTable data={test} />
        </Box>
      </Flex>
    </>
  )
}
