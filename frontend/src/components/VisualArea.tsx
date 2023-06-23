import { useState } from 'react'
import { AddIcon, InfoIcon } from '@chakra-ui/icons'
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

import { FAQModal } from './FAQModal'
import { GraphVisualization } from './GraphVisualization'

export const VisualArea = () => {
  const [faqOpen, setFAQOpen] = useState(false)

  const [childKeys, setChildKeys] = useState<string[]>([])
  const [tabIndex, setTabIndex] = useState<number>(0)

  const eraseVisualization = (key: string) => {
    const index = childKeys.findIndex((x) => x === key)
    if (index === -1) return
    if (tabIndex >= index) setTabIndex(tabIndex === 0 ? 0 : tabIndex - 1)
    setChildKeys(childKeys.filter((x) => x !== key))
  }

  const addVisualization = () => {
    setTabIndex(childKeys.length)
    setChildKeys([...childKeys, uuidv4()])
  }

  return (
    <>
      <Tabs w="full" index={tabIndex} onChange={(index) => setTabIndex(index)}>
        <TabList>
          <Button borderRadius={0} onClick={() => setFAQOpen(true)}>
            <InfoIcon />
          </Button>

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
              <TabPanel p={0} key={key}>
                <Flex h="calc(100vh - 189px)" alignItems="stretch">
                  <GraphVisualization erase={() => eraseVisualization(key)} />
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
      <FAQModal open={faqOpen} toggle={() => setFAQOpen(!faqOpen)} />
    </>
  )
}
