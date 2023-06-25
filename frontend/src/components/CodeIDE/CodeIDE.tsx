import { useColorModeValue } from '@chakra-ui/react'
import { python } from '@codemirror/lang-python'
import { zebraStripes } from '@uiw/codemirror-extensions-zebra-stripes'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror from '@uiw/react-codemirror'
import { useUserDataStore } from 'stores'

interface codeIDEProps {
  editable: boolean
  lineHighlight?: number
}

export const CodeIDE = (props: codeIDEProps) => {
  const { code, setCode } = useUserDataStore((state) => ({
    code: state.code,
    setCode: state.setCode,
  }))
  const placeholder = 'Enter your python code here!\nE.g. a = [1, 2, 3]'
  return (
    <CodeMirror
      value={code}
      height="calc(100vh - 125px)"
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
      ]}
      onChange={setCode}
      theme={useColorModeValue(githubLight, githubDark)}
    />
  )
}