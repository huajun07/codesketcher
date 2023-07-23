import 'react-data-grid/lib/styles.css'

import { useEffect, useState } from 'react'
import DataGrid, { Column } from 'react-data-grid'
import { DeleteIcon } from '@chakra-ui/icons'
import { Button, Center, Checkbox, Flex, Text, Tooltip } from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete'
import { useExecutionStore } from 'stores'
import { shallow } from 'zustand/shallow'

import { parsedVariable, parsedVariableArray } from 'utils/executor'

import styles from './index.module.css'

interface ArrayVisualizationProps {
  erase: () => void
}

export const ArrayVisualization = (props: ArrayVisualizationProps) => {
  const { erase } = props

  const [variableName, setVariableName] = useState('')
  const { allVariableNames, data } = useExecutionStore(
    (state) => ({
      allVariableNames: state.allVariableNames,
      data: state.data,
    }),
    shallow,
  )
  const [is2dArray, setIs2dArray] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    if (variableName === '') {
      setError('Please configure this visualization with a variable name')
      return
    }
    if (!data.some((x) => x.name === variableName)) {
      setError('Variable currently does not exist')
      return
    }
    setError('')
  }, [variableName, data, is2dArray])

  let value: parsedVariableArray = []
  if (error === '') {
    const tvalue = data.find((x) => x.name === variableName)?.value
    if (!is2dArray && !Array.isArray(tvalue))
      setError('Variable is not an array')
    else if (
      is2dArray &&
      (!Array.isArray(tvalue) || tvalue.some((row) => !Array.isArray(row)))
    ) {
      setError('Variable is not a 2d array')
    } else value = tvalue as parsedVariableArray
  }

  return (
    <Flex w="full" h="full" direction="column">
      <Flex mt={2} mx={4} align="center">
        <Text mr={2} as="b">
          Array:
        </Text>
        <AutoComplete
          openOnFocus
          value={variableName}
          onChange={setVariableName}
          defaultValues={[variableName]}
          emptyState={
            <Center>
              <Text as="b">No variables found</Text>
            </Center>
          }
          freeSolo
        >
          <AutoCompleteInput
            placeholder="Search..."
            onChange={(event) => setVariableName(event.target.value)}
          />
          <AutoCompleteList>
            {allVariableNames.map((name) => (
              <AutoCompleteItem key={name} value={name} />
            ))}
          </AutoCompleteList>
        </AutoComplete>
        <Tooltip label="Delete visualization">
          <Button onClick={erase} colorScheme="red" opacity={0.8} ml={8}>
            <DeleteIcon />
          </Button>
        </Tooltip>
      </Flex>
      <Flex align="center" mt={3} mx={4}>
        2-dimensional array:{' '}
        <Checkbox
          aria-label="2d-array"
          ml={2}
          checked={is2dArray}
          onInput={() => setIs2dArray(!is2dArray)}
        />
      </Flex>

      <Center w="full" px={4} flexGrow={1} minH={0}>
        {error ? (
          <Text>{error}</Text>
        ) : !is2dArray ? (
          // 1-dimensional array
          <DataGrid
            className={'rdg-light ' + styles['array']}
            style={{ blockSize: 'auto' }}
            rows={(() => {
              const row: Record<string, string> = {}
              value.forEach(
                (item, index) => (row[index.toString()] = item.toString()),
              )
              return [row]
            })()}
            columns={value.map((_, index) => ({
              key: index.toString(),
              name: index.toString(),
            }))}
          />
        ) : (
          // 2-dimensional array
          <DataGrid
            className={'rdg-light ' + styles['array']}
            style={{
              blockSize: 'auto',
              height: '100%',
              minWidth: 0,
              gridTemplateColumns: 'max-content',
            }}
            rows={(() => {
              const width = Math.max(
                ...value.map((row) => (row as parsedVariable[]).length),
              )
              const rows: Record<string, string>[] = []
              for (let i = 0; i < value.length; i++) {
                const rowValues = value[i] as parsedVariable[]
                const row: Record<string, string> = { row: i.toString() }
                for (let j = 0; j < Math.max(rowValues.length, width); j++) {
                  if (j < rowValues.length)
                    row[j.toString()] = rowValues[j].toString()
                  else row[j.toString()] = ''
                }
                rows.push(row)
              }
              return rows
            })()}
            columns={(() => {
              const width = Math.max(
                ...value.map((row) => (row as parsedVariable[]).length),
              )
              const columns: Column<Record<string, string>>[] = [
                { key: 'row', name: '', frozen: true },
              ]
              for (let i = 0; i < width; i++)
                columns.push({
                  key: i.toString(),
                  name: i.toString(),
                })
              return columns
            })()}
          />
        )}
      </Center>
    </Flex>
  )
}
