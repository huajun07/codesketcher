import { useRef, useState } from 'react'
import { AddIcon, DeleteIcon, MinusIcon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Text, Tooltip } from '@chakra-ui/react'
import cytoscape from 'cytoscape'
import { useExecutionStore } from 'stores'
import { shallow } from 'zustand/shallow'

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
  selected: boolean
}

export const GraphVisualization = (props: GraphVisualizationProps) => {
  const { erase, selected } = props

  const [settings, setSettings] = useState<GraphSettings>({
    directed: false,
    weighted: false,
    edgeFormat: EdgeFormat.AdjacencyList,
    edgesVariableName: '',
    displayVariableNames: [],
  })
  const [settingsOpen, setSettingsOpen] = useState(true)

  const data = useExecutionStore((state) => state.data, shallow)

  const [error, setError] = useState('')
  const updateErrorMessage = (newError: string) => {
    if (newError === error) return
    setError(newError)
  }

  const cyRef = useRef<cytoscape.Core>(null)
  const zoom = (zoomIn: boolean) => {
    if (cyRef.current === null) return
    const cy = cyRef.current
    const newZoomLevel = cy.zoom() * (zoomIn ? 1.5 : 1 / 1.5)
    cy.animate(
      {
        zoom: newZoomLevel,
        center: { eles: '$nodes' },
      },
      { duration: 80 },
    )
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
    <Box w="full" h="full" position="relative">
      <Tooltip label="Settings">
        <Button
          onClick={() => setSettingsOpen(!settingsOpen)}
          mt={4}
          ml={4}
          position="absolute"
          zIndex={1}
          opacity={0.8}
        >
          <SettingsIcon />
        </Button>
      </Tooltip>

      <Tooltip label="Delete">
        <Button
          onClick={erase}
          mt={4}
          mr={4}
          position="absolute"
          right="0"
          zIndex={1}
          colorScheme="red"
          opacity={0.8}
        >
          <DeleteIcon />
        </Button>
      </Tooltip>

      <Tooltip label="Zoom in">
        <Button
          onClick={() => zoom(true)}
          borderBottomRadius={0}
          mb={12}
          mr={4}
          position="absolute"
          bottom="0"
          right="0"
          size="sm"
          borderBottom="1px"
          borderBottomColor="gray.300"
          zIndex={1}
          opacity={0.8}
        >
          <AddIcon />
        </Button>
      </Tooltip>
      <Tooltip label="Zoom out">
        <Button
          onClick={() => zoom(false)}
          borderTopRadius={0}
          mb={4}
          mr={4}
          position="absolute"
          bottom="0"
          right="0"
          size="sm"
          zIndex={1}
          opacity={0.8}
        >
          <MinusIcon />
        </Button>
      </Tooltip>

      {error && (
        <Center h="full" w="full" px={8}>
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
          cyRef={cyRef}
          locked={selected}
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
