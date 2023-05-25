import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'

import { CodeIDE, CodeIDEButtons } from 'components'

export const Main = () => {
  const [editing, setEditing] = useState(true)
  return (
    <>
      <Flex>
        <Box
          w="500px"
          overflowX="scroll"
          height="calc(100vh - 64px)"
          borderRightWidth="1px"
        >
          <CodeIDEButtons
            editing={editing}
            toggleMode={() => setEditing(!editing)}
          />
          <CodeIDE editable={editing} lineHighlight={2} />
        </Box>
      </Flex>
    </>
  )
}
