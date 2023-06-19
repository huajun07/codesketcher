import { useState } from 'react'
import {
  Box,
  Center,
  Flex,
  Spinner,
  useInterval,
  useToast,
} from '@chakra-ui/react'
import useExecutionStore from 'stores/executionStore'

import { getInstructions } from 'utils/executor'
import {
  CodeIDE,
  CodeIDEButtons,
  ControlBar,
  DataTable,
  IO,
  VisualArea,
} from 'components'

export const Main = () => {
  const { instructions, setInstructions, currentStep, setStep } =
    useExecutionStore((state) => ({
      instructions: state.instructions,
      setInstructions: state.setInstructions,
      currentStep: state.currentStep,
      setStep: state.setStep,
    }))
  const [editing, setEditing] = useState(true)
  const [isPlaying, setPlaying] = useState(false)
  const [wasPlaying, setWasPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string | null>(null)
  const [ioIndex, setIOIndex] = useState(0)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const toast = useToast()

  const toggleEditing = async () => {
    if (editing) {
      // Start playing
      setLoading(true)
      const {
        instructions: newInstructions,
        output: newOutput,
        errorMessage,
      } = await getInstructions(code, input)
      if (!newInstructions || errorMessage) {
        setLoading(false)
        toast({
          title: 'An Error Has Occured',
          description: errorMessage,
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
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
    <>
      <Flex>
        <Box minW="500px" borderRightWidth="1px">
          <CodeIDEButtons
            editing={editing}
            toggleMode={toggleEditing}
            isDisabled={loading}
          />
          <CodeIDE
            code={code}
            setCode={setCode}
            editable={editing}
            lineHighlight={
              currentStep > 0 ? instructions[currentStep - 1].line_number : 0
            }
          />
        </Box>
        <Flex position="relative" flex={1}>
          {loading ? (
            <Center
              position="absolute"
              h="100%"
              w="100%"
              bg="rgba(0, 0, 0, .5)"
              zIndex={10}
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
          <Flex w="500px" borderRightWidth="1px" flexDirection="column">
            <DataTable />
            <IO
              input={input}
              setInput={setInput}
              output={output}
              index={ioIndex}
              setIndex={setIOIndex}
            />
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
    </>
  )
}
