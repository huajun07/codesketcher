import { useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'

import { ArrayWidget } from './ArrayWidget'
import { CodeExamples } from './CodeExample'
import { GettingStarted } from './GettingStarted'
import { GraphWidget } from './GraphWidget'

interface FAQModalProps {
  open: boolean
  toggle: () => void
}

export const FAQModal = (props: FAQModalProps) => {
  const { open, toggle } = props
  const [index, setIndex] = useState(0)
  return (
    <Modal isOpen={open} onClose={toggle}>
      <ModalOverlay />
      <ModalContent maxW="1000px" py={8}>
        <ModalCloseButton />
        <ModalBody>
          <Tabs
            defaultIndex={index}
            onChange={(newIndex) => setIndex(newIndex)}
          >
            <TabList>
              <Tab>Getting Started</Tab>
              <Tab>Graph Widget</Tab>
              <Tab>Array Widget</Tab>
              <Tab>Code Examples</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <GettingStarted />
              </TabPanel>
              <TabPanel>
                <GraphWidget />
              </TabPanel>
              <TabPanel>
                <ArrayWidget />
              </TabPanel>
              <TabPanel>
                <CodeExamples toggle={toggle} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
