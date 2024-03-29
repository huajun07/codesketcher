import {
  Box,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { useUserDataStore } from 'stores'
import { shallow } from 'zustand/shallow'

import { TextIDE } from './TextIDE'

interface IOProps {
  output?: string | null
  index: number
  editing: boolean
  setIndex: (newIndex: number) => void
}

export const IO = (props: IOProps) => {
  const { input, setInput, curFile, loggedIn } = useUserDataStore(
    (state) => ({
      loggedIn: state.loggedIn,
      input: state.input,
      setInput: state.setInput,
      curFile: state.curFile,
    }),
    shallow,
  )
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
          <TabList bg="gray.100">
            <Tab
              borderRight="1px"
              borderColor="gray.200"
              _selected={{ bg: 'hsl(0deg 0% 97.5%)' }}
            >
              Input{input !== curFile.input && loggedIn && <sup>*</sup>}
            </Tab>
            <Tab
              _selected={{ bg: 'hsl(0deg 0% 97.5%)' }}
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
          <TabPanels overflowY="scroll" height="100%" maxH="calc(60vh - 148px)">
            <TabPanel padding={0} height="100%">
              <Box height="100%">
                <TextIDE
                  placeholder="Enter your input here (if any) "
                  text={input}
                  setText={setInput}
                  editable={props.editing}
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
