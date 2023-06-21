import { useState } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import {
  AddIcon,
  DeleteIcon,
  QuestionIcon,
  SettingsIcon,
} from '@chakra-ui/icons'
import {
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
  useDisclosure,
} from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete'
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import { useExecutionStore } from 'stores'

import {
  adjacencyMatrixToList,
  assertAdjacencyListUnweighted,
  assertAdjacencyListWeighted,
  assertAdjacencyMatrix,
} from 'utils/graph'

cytoscape.use(cola)

enum EdgeFormat {
  AdjacencyMatrix = 'Adjacency Matrix',
  AdjacencyList = 'Adjacency List',
}

interface GraphVisualizationProps {
  erase: () => void
}

export const GraphVisualization = (props: GraphVisualizationProps) => {
  const { erase } = props
  const { data, allVariableNames } = useExecutionStore((state) => ({
    data: state.data,
    allVariableNames: state.allVariableNames,
    currentStep: state.currentStep,
  }))
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [edgeFormat, setEdgeFormat] = useState<EdgeFormat>(
    EdgeFormat.AdjacencyList,
  )
  const [directed, setDirected] = useState(false)
  const [weighted, setWeighted] = useState(false)
  const [edgesVariableName, setEdgesVariableName] = useState('')
  const [displayVariableNames, setDisplayVariableNames] = useState<string[]>([])
  const [error, setError] = useState('')
  const updateErrorMessage = (newError: string) => {
    if (newError === error) return
    setError(newError)
  }

  const edgesVariable = data.find(
    (item) => item.name === edgesVariableName,
  )?.value

  let adjacencyList: number[][] | [number, number][][] | undefined = undefined
  if (edgesVariableName === '') {
    updateErrorMessage(
      'Please configure this visualization by clicking the settings icon',
    )
  } else if (edgesVariable === undefined) {
    updateErrorMessage('Chosen adjacency matrix/list is currently undefined')
  } else {
    if (edgesVariable !== undefined) {
      if (edgeFormat === EdgeFormat.AdjacencyList) {
        if (!weighted) {
          // unweighted adjacency list
          if (!assertAdjacencyListUnweighted(edgesVariable))
            updateErrorMessage(
              'Given variable is not an unweighted adjacency list',
            )
          else {
            adjacencyList = edgesVariable
            updateErrorMessage('')
          }
        } else {
          // weighted adjacency List
          if (!assertAdjacencyListWeighted(edgesVariable))
            updateErrorMessage(
              'Given variable is not a weighted adjacency list',
            )
          else {
            adjacencyList = edgesVariable
            updateErrorMessage('')
          }
        }
      } else {
        // adjacency matrix
        if (!assertAdjacencyMatrix(edgesVariable))
          updateErrorMessage('Given variable is not a adjacency matrix')
        else {
          adjacencyList = adjacencyMatrixToList(edgesVariable, weighted)
          updateErrorMessage('')
        }
      }
    }
  }
  const displayData: { name: string; array: string[] }[] = []
  for (const displayVariableName of displayVariableNames) {
    const variable = data.find(
      (item) => item.name === displayVariableName,
    )?.value
    if (variable === undefined || !Array.isArray(variable)) continue
    displayData.push({
      name: displayVariableName,
      array: variable.map((x) => x.toString()),
    })
  }

  return (
    <Box width="full" minH="400px">
      <Button onClick={onOpen} borderRadius={0} position="absolute" zIndex={1}>
        <SettingsIcon />
      </Button>
      <Button onClick={erase} position="absolute" right="0" zIndex={1}>
        <DeleteIcon />
      </Button>

      {error && (
        <Center h="100%" minH="inherit">
          <Text>{error}</Text>
        </Center>
      )}
      {!error && (
        <Box>
          <Graph
            // If there is no error, then adjacencyList must be defined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            adjacencyList={adjacencyList!}
            directed={directed}
            weighted={weighted}
            displayData={displayData}
          ></Graph>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Title</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box>
              <Text as="b">Edge Format</Text>
              <RadioGroup
                onChange={(value: EdgeFormat) => setEdgeFormat(value)}
                value={edgeFormat}
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
              <AutoComplete
                openOnFocus
                value={edgesVariableName}
                onChange={setEdgesVariableName}
                defaultValues={[edgesVariableName]}
                freeSolo
              >
                <AutoCompleteInput />
                <AutoCompleteList>
                  {allVariableNames.map((name) => (
                    <AutoCompleteItem key={name} value={name} />
                  ))}
                </AutoCompleteList>
              </AutoComplete>
            </Box>

            <Box mt={4}>
              <Text as="b">Graph Properties</Text>
              <Flex direction="column">
                <Checkbox
                  defaultChecked={directed}
                  onChange={() => setDirected(!directed)}
                >
                  Directed
                </Checkbox>
                <Checkbox
                  defaultChecked={weighted}
                  onChange={() => setWeighted(!weighted)}
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
              {displayVariableNames.map((name, index) => (
                <Flex>
                  <AutoComplete
                    key={index}
                    openOnFocus
                    value={name}
                    onChange={(newName) => {
                      displayVariableNames[index] = newName
                      setDisplayVariableNames([...displayVariableNames])
                    }}
                    defaultValues={[name]}
                    freeSolo
                    placeholder="Enter a variable name"
                  >
                    <AutoCompleteInput />
                    <AutoCompleteList>
                      {allVariableNames.map((name) => (
                        <AutoCompleteItem key={name} value={name} />
                      ))}
                    </AutoCompleteList>
                  </AutoComplete>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      setDisplayVariableNames([
                        ...displayVariableNames.slice(0, index),
                        ...displayVariableNames.slice(index + 1),
                      ])
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Flex>
              ))}
              <Button
                onClick={() =>
                  setDisplayVariableNames([...displayVariableNames, ''])
                }
              >
                <AddIcon />
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

interface GraphProps {
  directed: boolean
  weighted: boolean
  adjacencyList: number[][] | [number, number][][]
  displayData: { name: string; array: string[] }[]
}

const Graph = (props: GraphProps) => {
  const { directed, weighted, adjacencyList, displayData } = props

  const n = adjacencyList.length
  const elements: cytoscape.ElementDefinition[] = []
  for (let i = 0; i < n; i++) {
    const label = i.toString()
    const contents = []
    contents.push(label)
    for (const { name, array } of displayData) {
      if (array.length <= i) continue
      contents.push(`${name}: ${array[i]}`)
    }
    elements.push({
      group: 'nodes',
      data: {
        id: i.toString(),
        label,
        content: contents.join('\n'),
      },
    })
  }

  for (let i = 0; i < n; i++) {
    if (weighted) {
      for (const [v, weight] of adjacencyList[i] as [number, number][]) {
        elements.push({
          group: 'edges',
          data: {
            source: i.toString(),
            target: v.toString(),
            label: weight.toString(),
          },
        })
      }
    } else {
      for (const v of adjacencyList[i] as number[]) {
        elements.push({
          group: 'edges',
          data: {
            source: i.toString(),
            target: v.toString(),
          },
        })
      }
    }
  }

  return (
    <CytoscapeComponent
      elements={elements}
      layout={{ name: 'cola' }}
      style={{ height: '400px', width: '100%' }}
      stylesheet={[
        {
          selector: 'edge',
          style: {
            width: 4,
            ...(directed && {
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
            }),
            ...(weighted && {
              label: 'data(label)',
            }),
          },
        },
        {
          selector: 'node',
          style: {
            'border-color': 'black',
            'border-width': '1px',
            label: 'data(content)',
            'font-size': '0.75em',
            'text-wrap': 'wrap',
          },
        },
      ]}
    />
  )
}
