import { useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  Button,
  Center,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'

import { GraphVisualization } from './GraphVisualization'

export const VisualArea = () => {
  const [childKeys, setChildKeys] = useState<string[]>([])

  const eraseVisualization = (key: string) => {
    setChildKeys(childKeys.filter((x) => x !== key))
  }

  const addVisualization = () => {
    setChildKeys([...childKeys, uuidv4()])
  }

  return (
    <Tabs w="full">
      <TabList>
        {childKeys.map((key, index) => (
          <Tab key={key}>{index}</Tab>
        ))}

        <Button borderRadius={0} onClick={addVisualization}>
          <AddIcon />
        </Button>
      </TabList>

      {childKeys.length > 0 ? (
        <TabPanels h="full">
          {childKeys.map((key) => (
            <TabPanel h="full" p={0}>
              <Flex h="full" alignItems="stretch">
                <GraphVisualization
                  key={key}
                  erase={() => eraseVisualization(key)}
                />
              </Flex>
            </TabPanel>
          ))}
        </TabPanels>
      ) : (
        <Center h="full" w="full">
          Click the "+" button above to add a visualization and get started!
        </Center>
      )}
    </Tabs>
  )
}
