import CodeMirror from '@uiw/react-codemirror'

export interface textIDEProps {
  placeholder?: string
  setText?: (text: string) => void
  text: string
  editable: boolean
}

export const TextIDE = (props: textIDEProps) => {
  return (
    <CodeMirror
      value={props.text}
      height="100%"
      style={{ height: '100%' }}
      editable={props.editable}
      readOnly={!props.editable}
      placeholder={props.placeholder}
      autoFocus={true}
      width="100%"
      basicSetup={{
        lineNumbers: false,
        highlightActiveLine: props.editable,
      }}
      extensions={[]}
      onChange={props.setText}
    />
  )
}
