import { createContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Center,
  Flex,
  Spinner,
  useInterval,
  useToast,
} from '@chakra-ui/react'
import { useExecutionStore, useUserDataStore } from 'stores'
import { shallow } from 'zustand/shallow'

import { getInstructions } from 'utils/executor'
import { getCodeValues } from 'utils/files'
import {
  CodeIDE,
  CodeIDEButtons,
  ControlBar,
  DataTable,
  IO,
  VisualArea,
} from 'components'

export const LoaderContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined)

export const Main = () => {
  const { code, input, setCode, setInput } = useUserDataStore(
    (state) => ({
      code: state.code,
      input: state.input,
      setCode: state.setCode,
      setInput: state.setInput,
    }),
    shallow,
  )
  const { instructions, setInstructions, currentStep, setStep } =
    useExecutionStore(
      (state) => ({
        instructions: state.instructions,
        setInstructions: state.setInstructions,
        currentStep: state.currentStep,
        setStep: state.setStep,
      }),
      shallow,
    )
  const [editing, setEditing] = useState(true)
  const [isPlaying, setPlaying] = useState(false)
  const [wasPlaying, setWasPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [ioIndex, setIOIndex] = useState(0)

  const [searchParams, setSearchParams] = useSearchParams()

  const toast = useToast()
  const makeToast = (msg: string | undefined) => {
    toast({
      title: 'An Error Has Occured',
      description: msg,
      status: 'error',
      duration: 2000,
      isClosable: true,
    })
  }

  useEffect(() => {
    // Clean url search params to avoid repeated loading
    const cleanUrl = () => {
      searchParams.delete('id')
      setSearchParams(searchParams)
    }
    const id = searchParams.get('id')
    if (id) {
      getCodeValues(id)
        .then((val) => {
          const { code, input } = val
          setCode(code)
          setInput(input || '')
          cleanUrl()
        })
        .catch((_err) => {
          makeToast('Code Not Found')
          cleanUrl()
        })
    }
  })

  useInterval(
    () => {
      // sanity check
      if (currentStep >= 0 && currentStep < instructions.length) {
        setStep(currentStep + 1)
      }
      if (currentStep >= instructions.length - 1) {
        setPlaying(false)
      }
      setLoading(false)
    },
    isPlaying ? Math.ceil(1000 / speed) : null,
  )

  const moveStep = (forward: boolean) => {
    const newStep = Math.min(
      instructions.length,
      Math.max(0, (forward ? 1 : -1) * speed + currentStep),
    )
    setStep(newStep)
    if (newStep >= instructions.length) {
      setPlaying(false)
    }
  }

  const toggleEditing = async () => {
    if (editing) {
      // Start playing
      setLoading(true)
      if (code === '') {
        setLoading(false)
        makeToast('Code cannot be empty!')
        return
      }
      const {
        instructions: newInstructions,
        output: newOutput,
        errorMessage,
      } = await getInstructions(code, input)
      if (!newInstructions || errorMessage) {
        setLoading(false)
        makeToast(errorMessage)
        return
      }
      setInstructions(newInstructions)
      setIOIndex(1)
      setOutput(newOutput || '')
      setPlaying(true)
      setWasPlaying(false)
    } else {
      // Stop playing
      setPlaying(false)
    }
    setEditing(!editing)
  }

  return (
    <LoaderContext.Provider value={setLoading}>
      {loading ? (
        <Center
          position="absolute"
          h="100%"
          w="100%"
          bg="rgba(0, 0, 0, .5)"
          zIndex={3000}
        >
          <Spinner
            thickness="10px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            h="calc(20vh)"
            w="calc(20vh)"
            opacity={1}
          />
        </Center>
      ) : null}
      <Flex>
        <Box minW="500px" borderRightWidth="1px">
          <CodeIDEButtons
            editing={editing}
            toggleMode={toggleEditing}
            isDisabled={loading}
          />
          <CodeIDE
            editable={editing}
            lineHighlight={
              currentStep > 0 ? instructions[currentStep - 1].line_number : 0
            }
          />
        </Box>
        <Flex position="relative" flex={1}>
          <Flex w="500px" borderRightWidth="1px" flexDirection="column">
            <DataTable />
            <IO output={output} index={ioIndex} setIndex={setIOIndex} />
          </Flex>
          <Flex flex={1} flexDirection="column" minW="500px">
            <Flex flex={1}>
              <VisualArea />
            </Flex>
            <Box>
              <ControlBar
                length={instructions.length}
                playing={isPlaying}
                curSpeed={speed}
                setSpeed={setSpeed}
                togglePlaying={() => {
                  if (isPlaying || currentStep < instructions.length)
                    setPlaying(!isPlaying)
                }}
                disabled={editing}
                wasPlaying={wasPlaying}
                setWasPlaying={setWasPlaying}
                moveStep={moveStep}
              />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </LoaderContext.Provider>
  )
}
