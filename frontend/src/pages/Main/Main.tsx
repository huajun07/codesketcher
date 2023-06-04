import { useState } from 'react'
import {
  Box,
  Center,
  Flex,
  Spinner,
  useInterval,
  useToast,
} from '@chakra-ui/react'

import {
  getInstructions,
  instruction,
  parsedVariable,
  parseVariableValue,
} from 'utils/executor'
import {
  CodeIDE,
  CodeIDEButtons,
  ControlBar,
  DataTable,
  InputIDE,
  VisualArea,
} from 'components'

interface dataVal {
  name: string
  value: parsedVariable
}

export const Main = () => {
  const [instructions, setInstructions] = useState<instruction[]>([])
  const [editing, setEditing] = useState(true)
  const [data, setData] = useState<dataVal[]>([])
  const [isPlaying, setPlaying] = useState(false)
  const [wasPlaying, setWasPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const [curIdx, setCurIdx] = useState(0)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData = (name: string, value: any, dataArr: dataVal[]) => {
    const idx = dataArr.findIndex((item) => item.name === name)
    const newData = { name, value }
    if (idx !== -1) dataArr[idx] = newData
    else dataArr.push(newData)
  }

  const setDataIdx = (idx: number) => {
    const newData: dataVal[] = []
    for (let i = 0; i < idx; i++) {
      const newInstructions = instructions[i].variable_changes
      for (const [key, value] of Object.entries(newInstructions)) {
        updateData(key, parseVariableValue(value), newData)
      }
    }
    setData(newData)
    setCurIdx(idx)
  }

  useInterval(
    () => {
      // sanity check
      if (curIdx >= 0 && curIdx < instructions.length) {
        setDataIdx(curIdx + 1)
      }
      if (curIdx >= instructions.length - 1) {
        setPlaying(false)
      }
      setLoading(false)
    },
    isPlaying ? Math.ceil(1000 / speed) : null,
  )

  const moveStep = (forward: boolean) => {
    const newIdx = Math.min(
      instructions.length,
      Math.max(0, (forward ? 1 : -1) * speed + curIdx),
    )
    setDataIdx(newIdx)
    if (newIdx >= instructions.length) {
      setPlaying(false)
    }
  }

  const toast = useToast()

  const toggleEditing = async () => {
    if (editing) {
      // Start playing
      setLoading(true)
      const { instructions: newInstructions, errorMessage } =
        await getInstructions(code)
      if (!newInstructions) {
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
      setCurIdx(0)
      setData([])
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
              curIdx > 0 ? instructions[curIdx - 1].line_number : 0
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
            <DataTable data={data} />
            <InputIDE />
          </Flex>
          <Flex flex={1} flexDirection="column" minW="500px">
            <Flex flex={1}>
              <VisualArea />
            </Flex>
            <Box>
              <ControlBar
                curIdx={curIdx}
                length={instructions.length}
                playing={isPlaying}
                curSpeed={speed}
                setSpeed={setSpeed}
                togglePlaying={() => {
                  if (isPlaying || curIdx < instructions.length)
                    setPlaying(!isPlaying)
                }}
                setCurIdx={setDataIdx}
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
