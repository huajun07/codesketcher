import { useState } from 'react'
import { Box, Flex, useInterval } from '@chakra-ui/react'

import { getInstructions, instruction } from 'utils/executor'
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
  value: string | number
}

export const Main = () => {
  const [instructions, setInstructions] = useState<instruction[]>([])
  const [editing, setEditing] = useState(true)
  const [data, setData] = useState<dataVal[]>([])
  const [isPlaying, setPlaying] = useState(false)
  const [wasPlaying, setWasPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const [curIdx, setCurIdx] = useState(0)
  const [code, setCode] = useState("print('hello world')")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData = (name: string, value: any, dataArr: dataVal[]) => {
    const idx = dataArr.findIndex((item) => item.name === name)
    const newData = { name, value }
    if (idx !== -1) dataArr[idx] = newData
    else dataArr.push(newData)
  }

  useInterval(
    () => {
      // sanity check
      if (curIdx >= 0 && curIdx < instructions.length) {
        setCurIdx(curIdx + 1) // This is updated after the hook is called
        const newInstructions = instructions[curIdx].variable_changes
        console.log(curIdx, newInstructions, instructions)
        for (const [key, value] of Object.entries(newInstructions)) {
          updateData(key, value, data)
        }
        setData(data)
      }
      if (curIdx >= instructions.length - 1) {
        setPlaying(false)
      }
    },
    isPlaying ? Math.ceil(1000 / speed) : null,
  )

  const setDataIdx = (idx: number) => {
    const newData: dataVal[] = []
    for (let i = 0; i < idx; i++) {
      const newInstructions = instructions[i].variable_changes
      for (const [key, value] of Object.entries(newInstructions)) {
        updateData(key, value, newData)
      }
    }
    setData(newData)
    setCurIdx(idx)
  }

  const toggleEditing = async () => {
    if (editing) {
      // Start playing
      const newInstructions = await getInstructions(code)
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
        <Box w="500px" overflowX="scroll" borderRightWidth="1px">
          <CodeIDEButtons editing={editing} toggleMode={toggleEditing} />
          <CodeIDE
            code={code}
            setCode={setCode}
            editable={editing}
            lineHighlight={
              curIdx > 0 ? instructions[curIdx - 1].line_number : 0
            }
          />
        </Box>
        <Flex w="500px" borderRightWidth="1px" flexDirection="column">
          <DataTable data={data} />
          <InputIDE />
        </Flex>
        <Flex flex={1} flexDirection="column">
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
            />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}
