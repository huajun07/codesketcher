import { useState } from 'react'
import { Box, Flex, useInterval } from '@chakra-ui/react'

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

interface instruction {
  line_number: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variable_changes: Record<string, any>
}

interface MainProps {
  instructions: instruction[]
}

export const Main = (props: MainProps) => {
  const [editing, setEditing] = useState(true)
  const [data, setData] = useState<dataVal[]>([])
  const [isPlaying, setPlaying] = useState(false)
  const [wasPlaying, setWasPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const [curIdx, setCurIdx] = useState(0)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData = (name: string, value: any, dataArr: dataVal[]) => {
    const idx = dataArr.findIndex((item) => item.name === name)
    const newData = { name, value }
    if (idx !== -1) dataArr[idx] = newData
    else dataArr.push(newData)
  }

  useInterval(
    () => {
      setCurIdx(curIdx + 1) // This is updated after the hook is called
      // sanity check
      if (curIdx >= 0 && curIdx < props.instructions.length) {
        const newInstructions = props.instructions[curIdx].variable_changes
        console.log(curIdx, newInstructions, props.instructions)
        for (const [key, value] of Object.entries(newInstructions)) {
          updateData(key, value, data)
        }
        setData(data)
      }
      if (curIdx >= props.instructions.length - 1) {
        setPlaying(false)
      }
    },
    isPlaying ? Math.ceil(1000 / speed) : null,
  )

  const setDataIdx = (idx: number) => {
    const newData: dataVal[] = []
    for (let i = 0; i < idx; i++) {
      const newInstructions = props.instructions[i].variable_changes
      for (const [key, value] of Object.entries(newInstructions)) {
        updateData(key, value, newData)
      }
    }
    setData(newData)
    setCurIdx(idx)
  }

  const toggleEditing = () => {
    if (editing) {
      // Start playing
      /* Fetch instructions TODO*/
      setCurIdx(0)
      setData([])
      setPlaying(true)
      setWasPlaying(false)
      console.log('Start playing')
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
            editable={editing}
            lineHighlight={
              curIdx > 0 ? props.instructions[curIdx - 1].line_number : 0
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
              length={props.instructions.length}
              playing={isPlaying}
              curSpeed={speed}
              setSpeed={setSpeed}
              togglePlaying={() => {
                if (isPlaying || curIdx < props.instructions.length)
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
