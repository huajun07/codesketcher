import {
  Box,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'

import { TextIDE } from './TextIDE'

interface IOProps {
  input: string
  setInput: (text: string) => void
  output?: string | null
  index: number
  setIndex: (newIndex: number) => void
}

export const IO = (props: IOProps) => {
  return (
    <>
      <Box flex={1} borderTop="1px" borderColor="gray.300">
        <Tabs
          isFitted
          variant="enclosed"
          width="100%"
          height="100%"
          index={props.index}
          onChange={props.setIndex}
        >
          <TabList bg="hsl(0deg 0% 97.5%)">
            <Tab
              borderRight="1px"
              borderColor="gray.200"
              _selected={{ bg: 'gray.100' }}
            >
              Input
            </Tab>
            <Tab
              _selected={{ bg: 'gray.100' }}
              isDisabled={props.output === null}
            >
              Output
            </Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="gray.200"
            borderRadius="1px"
          />
          <TabPanels overflowY="scroll" height="100%" maxH="390px">
            <TabPanel padding={0} height="100%">
              <Box height="100%">
                <TextIDE
                  placeholder="Enter your input here (if any) "
                  text={props.input}
                  setText={props.setInput}
                  editable={true}
                />
              </Box>
            </TabPanel>
            <TabPanel padding={0} height="100%">
              <Box height="100%">
                <TextIDE text={props.output || ''} editable={false} />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}
