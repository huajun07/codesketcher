import { useCallback, useEffect, useRef } from 'react'
import { useColorModeValue } from '@chakra-ui/react'
import { python } from '@codemirror/lang-python'
import { EditorState, RangeSet } from '@codemirror/state'
import { GutterMarker } from '@codemirror/view'
import { zebraStripes } from '@uiw/codemirror-extensions-zebra-stripes'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror from '@uiw/react-codemirror'
import { useExecutionStore, useUserDataStore } from 'stores'
import { shallow } from 'zustand/shallow'

import { createBreakpointsExtension } from './CodeMirrorBreakpointExtension'

interface codeIDEProps {
  editable: boolean
  lineHighlight?: number
}

export const CodeIDE = (props: codeIDEProps) => {
  const updateSelectedLineNumbers = useExecutionStore(
    (state) => state.updateSelectedLineNumbers,
  )
  const { code, setCode, fileIndex } = useUserDataStore(
    (state) => ({
      code: state.code,
      setCode: state.setCode,
      fileIndex: state.curIdx,
    }),
    shallow,
  )

  const breakpointsExtensionCallback = useCallback(
    (state: EditorState, set: RangeSet<GutterMarker>) => {
      if (state === undefined) return
      const lineNumbers: number[] = []
      const iter = set.iter()
      while (iter.value !== null) {
        lineNumbers.push(state.doc.lineAt(iter.from).number)
        iter.next()
      }
      updateSelectedLineNumbers(lineNumbers)
    },
    [updateSelectedLineNumbers],
  )

  const breakpointsExtension = useRef(
    createBreakpointsExtension(breakpointsExtensionCallback),
  )
  useEffect(() => {
    // reset all state when the file changes
    breakpointsExtension.current = createBreakpointsExtension(
      breakpointsExtensionCallback,
    )
  }, [fileIndex, breakpointsExtensionCallback])

  const placeholder = 'Enter your python code here!\nE.g. a = [1, 2, 3]'
  return (
    <CodeMirror
      value={code}
      height="calc(100vh - 125px)"
      style={props.editable ? {} : { cursor: 'not-allowed' }}
      editable={props.editable}
      readOnly={!props.editable}
      placeholder={placeholder}
      autoFocus={true}
      width="500px"
      basicSetup={{
        highlightActiveLineGutter: props.editable,
        highlightActiveLine: props.editable,
      }}
      extensions={[
        zebraStripes({
          lineNumber: [props.lineHighlight || 0],
          lightColor: '#aca2ff33',
          darkColor: '#aca2ff40',
        }),
        python(),
        breakpointsExtension.current,
      ]}
      onChange={setCode}
      theme={useColorModeValue(githubLight, githubDark)}
    />
  )
}
