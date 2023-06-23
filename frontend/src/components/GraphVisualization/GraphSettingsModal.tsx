import { useRef, useState } from 'react'
import { AddIcon, DeleteIcon, QuestionIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete'
import { useExecutionStore } from 'stores'
import { v4 as uuidv4 } from 'uuid'

enum EdgeFormat {
  AdjacencyMatrix = 'Adjacency Matrix',
  AdjacencyList = 'Adjacency List',
}

export interface GraphSettings {
  directed: boolean
  weighted: boolean
  edgeFormat: EdgeFormat
  edgesVariableName: string
  displayVariableNames: string[]
}

interface GraphSettingsProps {
  settings: GraphSettings
  setSettings: (newSettings: GraphSettings) => void
  open: boolean
  toggle: () => void
}

export const GraphSettingsModal = (props: GraphSettingsProps) => {
  const { settings, setSettings, open, toggle } = props

  const [displayVariableKeys, setDisplayVariableKeys] = useState(
    settings.displayVariableNames.map((_) => uuidv4()),
  )

  const [showUpdated, setShowUpdated] = useState(false)
  const showUpdatedTimeout = useRef<number | null>(null)

  const updateSettings = (updates: Partial<GraphSettings>) => {
    setShowUpdated(true)
    if (showUpdatedTimeout.current !== null) {
      window.clearTimeout(showUpdatedTimeout.current)
    }
    showUpdatedTimeout.current = window.setTimeout(
      () => setShowUpdated(false),
      1500,
    )
    setSettings({ ...settings, ...updates })
  }

  return (
    <Modal isOpen={open} onClose={toggle}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Graph Settings</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Box>
            <Text as="b">Edge Format</Text>
            <RadioGroup
              onChange={(value: EdgeFormat) =>
                updateSettings({ edgeFormat: value })
              }
              value={settings.edgeFormat}
            >
              <Stack direction="row">
                <Radio value={EdgeFormat.AdjacencyList}>
                  {EdgeFormat.AdjacencyList}
                </Radio>
                <Radio value={EdgeFormat.AdjacencyMatrix}>
                  {EdgeFormat.AdjacencyMatrix}
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>

          <Box mt={4}>
            <Stack direction="row" align="baseline">
              <Text as="b">Edge Variable</Text>
              <Tooltip label="Name of the variable storing information about the edges">
                <QuestionIcon />
              </Tooltip>
            </Stack>
            <AutoCompleteVariables
              value={settings.edgesVariableName}
              update={(value) => {
                updateSettings({ edgesVariableName: value })
              }}
            />
          </Box>

          <Box mt={4}>
            <Text as="b">Graph Properties</Text>
            <Flex direction="column">
              <Checkbox
                defaultChecked={settings.directed}
                onChange={() =>
                  updateSettings({ directed: !settings.directed })
                }
              >
                Directed
              </Checkbox>
              <Checkbox
                defaultChecked={settings.weighted}
                onChange={() =>
                  updateSettings({ weighted: !settings.weighted })
                }
              >
                Weighted
              </Checkbox>
            </Flex>
          </Box>

          <Box mt={4}>
            <Stack direction="row" align="baseline">
              <Text as="b">Display Data</Text>
              <Tooltip label="Display some data about nodes as a node label (e.g. distance from source)">
                <QuestionIcon />
              </Tooltip>
            </Stack>
            <Flex direction="column">
              {settings.displayVariableNames.map((name, index) => (
                <Flex key={displayVariableKeys[index]}>
                  <AutoCompleteVariables
                    value={name}
                    update={(value) => {
                      const newSettings = [...settings.displayVariableNames]
                      newSettings[index] = value
                      updateSettings({
                        displayVariableNames: newSettings,
                      })
                    }}
                  />
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      updateSettings({
                        displayVariableNames: [
                          ...settings.displayVariableNames.slice(0, index),
                          ...settings.displayVariableNames.slice(index + 1),
                        ],
                      })
                      setDisplayVariableKeys([
                        ...displayVariableKeys.slice(0, index),
                        ...displayVariableKeys.slice(index + 1),
                      ])
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Flex>
              ))}
              <Button
                onClick={() => {
                  updateSettings({
                    displayVariableNames: [
                      ...settings.displayVariableNames,
                      '',
                    ],
                  })
                  setDisplayVariableKeys([...displayVariableKeys, uuidv4()])
                }}
              >
                <AddIcon />
              </Button>
            </Flex>
          </Box>

          <Box py={5} height="5em">
            {showUpdated && (
              <Alert py={2} status="success" borderRadius={4}>
                <AlertIcon />
                Settings updated
              </Alert>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

interface AutoCompleteVariablesProps {
  value: string
  update: (newValue: string) => void
}
const AutoCompleteVariables = (props: AutoCompleteVariablesProps) => {
  const { value, update } = props
  const allVariableNames = useExecutionStore((state) => state.allVariableNames)
  return (
    <AutoComplete
      openOnFocus
      value={value}
      onChange={update}
      defaultValues={[value]}
      emptyState={
        <Center>
          <Text as="b">No variables found</Text>
        </Center>
      }
      freeSolo
    >
      <AutoCompleteInput
        placeholder="Search..."
        onChange={(event) => update(event.target.value)}
      />
      <AutoCompleteList>
        {allVariableNames.map((name) => (
          <AutoCompleteItem key={name} value={name} />
        ))}
      </AutoCompleteList>
    </AutoComplete>
  )
}
