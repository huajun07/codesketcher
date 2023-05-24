import { Box, Flex } from '@chakra-ui/react'

import { CodeIDE } from 'components'

export const Main = () => {
  return (
    <>
      <Flex>
        <Box
          w="500px"
          overflowX="scroll"
          height="calc(100vh - 64px)"
          borderRightWidth="1px"
        >
          <CodeIDE />
        </Box>
      </Flex>
    </>
  )
}
