import React from 'react'
import { useColorModeValue } from '@chakra-ui/react'
import { python } from '@codemirror/lang-python'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror from '@uiw/react-codemirror'

export const CodeIDE = () => {
  const onChange = React.useCallback((value: string) => {
    console.log('value:', value)
  }, [])
  return (
    <CodeMirror
      value="print('hello world!')"
      height="calc(100vh - 80px)"
      extensions={[python()]}
      onChange={onChange}
      theme={useColorModeValue(githubLight, githubDark)}
    />
  )
}
