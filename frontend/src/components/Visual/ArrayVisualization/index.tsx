import { useEffect, useState } from 'react'
import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Flex, Text, Tooltip } from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete'
import { useExecutionStore } from 'stores'
import { shallow } from 'zustand/shallow'

import { parsedVariableArray } from 'utils/executor'

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
  }, [variableName, data])

  let value: parsedVariableArray = []
  if (error === '') {
    const tvalue = data.find((x) => x.name === variableName)?.value
    if (!Array.isArray(tvalue)) setError('Variable is not an array')
    else value = tvalue
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

      <Center w="full" px={4} flexGrow={1}>
        {error ? (
          <Text>{error}</Text>
        ) : (
          <Flex overflowX="scroll">
            {value.map((item) => (
              <Box
                key={item.toString()}
                border="1px solid"
                borderColor="blue.700"
                px={2}
                py={1}
              >
                {item.toString()}
              </Box>
            ))}
          </Flex>
        )}
      </Center>
    </Flex>
  )
}
