import { useState } from 'react'
import { DeleteIcon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Text } from '@chakra-ui/react'
import { useExecutionStore } from 'stores'

import {
  adjacencyMatrixToList,
  assertAdjacencyListUnweighted,
  assertAdjacencyListWeighted,
  assertAdjacencyMatrix,
} from 'utils/graph'

import { Graph } from './Graph'
import { GraphSettings, GraphSettingsModal } from './GraphSettingsModal'

enum EdgeFormat {
  AdjacencyMatrix = 'Adjacency Matrix',
  AdjacencyList = 'Adjacency List',
}

interface GraphVisualizationProps {
  erase: () => void
}

export const GraphVisualization = (props: GraphVisualizationProps) => {
  const { erase } = props

  const [settings, setSettings] = useState<GraphSettings>({
    directed: false,
    weighted: false,
    edgeFormat: EdgeFormat.AdjacencyList,
    edgesVariableName: '',
    displayVariableNames: [],
  })
  const [settingsOpen, setSettingsOpen] = useState(true)

  const data = useExecutionStore((state) => state.data)

  const [error, setError] = useState('')
  const updateErrorMessage = (newError: string) => {
    if (newError === error) return
    setError(newError)
  }

  const edgesVariable = data.find(
    (item) => item.name === settings.edgesVariableName,
  )?.value

  let adjacencyList: number[][] | [number, number][][] | undefined = undefined
  if (settings.edgesVariableName === '') {
    updateErrorMessage(
      'Please configure this visualization by clicking the settings icon',
    )
  } else if (edgesVariable === undefined) {
    updateErrorMessage('Chosen adjacency matrix/list is currently undefined')
  } else {
    if (edgesVariable !== undefined) {
      if (settings.edgeFormat === EdgeFormat.AdjacencyList) {
        if (!settings.weighted) {
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
          adjacencyList = adjacencyMatrixToList(
            edgesVariable,
            settings.weighted,
          )
          updateErrorMessage('')
        }
      }
    }
  }
  const displayData: { name: string; array: string[] }[] = []
  for (const displayVariableName of settings.displayVariableNames) {
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
    <Box w="full">
      <Button
        onClick={() => setSettingsOpen(!settingsOpen)}
        borderRadius={0}
        position="absolute"
        zIndex={1}
      >
        <SettingsIcon />
      </Button>
      <Button
        onClick={erase}
        borderRadius={0}
        position="absolute"
        right="0"
        zIndex={1}
        colorScheme="red"
      >
        <DeleteIcon />
      </Button>

      {error && (
        <Center h="full" w="full">
          <Text>{error}</Text>
        </Center>
      )}
      {!error && (
        <Graph
          // If there is no error, then adjacencyList must be defined
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          adjacencyList={adjacencyList!}
          directed={settings.directed}
          weighted={settings.weighted}
          displayData={displayData}
        />
      )}

      <GraphSettingsModal
        settings={settings}
        setSettings={setSettings}
        open={settingsOpen}
        toggle={() => setSettingsOpen(!settingsOpen)}
      />
    </Box>
  )
}
