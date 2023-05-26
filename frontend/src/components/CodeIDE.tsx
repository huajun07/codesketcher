import { useColorModeValue } from '@chakra-ui/react'
import { python } from '@codemirror/lang-python'
import { zebraStripes } from '@uiw/codemirror-extensions-zebra-stripes'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror from '@uiw/react-codemirror'

interface codeIDEProps {
  editable: boolean
  lineHighlight?: number
  code: string
  setCode: (code: string) => void
}

export const CodeIDE = (props: codeIDEProps) => {
  return (
    <CodeMirror
      value={props.code}
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
      onChange={props.setCode}
      theme={useColorModeValue(githubLight, githubDark)}
    />
  )
}
