import React from 'react'
import { useColorModeValue } from '@chakra-ui/react'
import { python } from '@codemirror/lang-python'
import { zebraStripes } from '@uiw/codemirror-extensions-zebra-stripes'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror from '@uiw/react-codemirror'

interface codeIDEProps {
  editable: boolean
  lineHighlight?: number
}

export const CodeIDE = (props: codeIDEProps) => {
  const onChange = React.useCallback((value: string) => {
    console.log('value:', value)
  }, [])
  return (
    <CodeMirror
      value="print('hello world!')"
      height="calc(100vh - 144px)"
      editable={props.editable}
      readOnly={!props.editable}
      extensions={[
        zebraStripes({
          lineNumber: [props.lineHighlight || 0],
          lightColor: '#aca2ff33',
          darkColor: '#aca2ff40',
        }),
        python(),
      ]}
      onChange={onChange}
      theme={useColorModeValue(githubLight, githubDark)}
    />
  )
}
