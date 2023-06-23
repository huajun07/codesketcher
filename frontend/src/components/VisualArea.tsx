import { useState } from 'react'
import { Button, Center, Flex } from '@chakra-ui/react'

import { GraphVisualization } from './GraphVisualization'

export const VisualArea = () => {
  const [childKeys, setChildKeys] = useState<number[]>([])

  const eraseVisualization = (key: number) => {
    setChildKeys([...childKeys.filter((x) => x !== key)])
  }

  const addVisualization = () => {
    const key = childKeys.length === 0 ? 0 : childKeys[childKeys.length - 1] + 1
    setChildKeys([...childKeys, key])
  }

  return (
    <>
      <Flex direction="column" w="full">
        {childKeys.map((key) => (
          <Center borderBottom="2px" borderColor="gray.300" key={key}>
            <GraphVisualization erase={() => eraseVisualization(key)} />
          </Center>
        ))}

        <Center borderBottom="2px" borderColor="gray.300">
          <Button
            h="full"
            w="full"
            py={4}
            borderRadius={0}
            onClick={addVisualization}
          >
            Add Visualization
          </Button>
        </Center>
      </Flex>
    </>
  )
}
