import { useState } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react'
import { useUserDataStore } from 'stores'

interface ModalProps {
  variant: 'create' | 'rename' | 'delete'
  open: boolean
  toggle: () => void
  triggerError: (message: string) => void
}

function getErrorMessage(error: unknown) {
  console.log(error)
  if (error instanceof Error) return error.message
  return String(error)
}

export const CodeIDEModal = (props: ModalProps) => {
  const { addFile, rename, deleteFile, codenames, curIdx } = useUserDataStore(
    (state) => ({
      addFile: state.addFile,
      rename: state.rename,
      deleteFile: state.deleteFile,
      codenames: state.codenames,
      curIdx: state.curIdx,
    }),
  )
  const { open, toggle, triggerError, variant } = props
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value)
  const checkError = () => {
    if (input === '') return { err: true, errorMsg: 'Name cannot be blank' }
    if (input.length > 100) return { err: true, errorMsg: 'Name is too long' }
    if (variant === 'rename' && codenames[curIdx] === input)
      return { err: true, errorMsg: 'No change in name' }
    if (codenames.includes(input))
      return { err: true, errorMsg: 'Name already exists' }
    return { err: false }
  }

  const close = () => {
    setInput('')
    toggle()
  }

  const action = async () => {
    if (variant === 'create') return await addFile(input)
    if (variant === 'rename') return await rename(input)
    if (variant === 'delete') return await deleteFile()
  }

  const handleSubmit = () => {
    // add loader
    action()
      .then(() => {
        close()
        // remove loader
      })
      .catch((err) => {
        triggerError(getErrorMessage(err))
        close()
        // remove loader
      })
  }

  const header = () => {
    if (variant === 'create') return 'Create new file'
    if (variant === 'rename') return 'Rename file'
    if (variant === 'delete') return 'Delete file?'
    return ''
  }
  return (
    <>
      <Modal isOpen={open} onClose={close}>
        <ModalContent>
          <ModalHeader>{header()}</ModalHeader>
          <ModalCloseButton />
          {variant !== 'delete' ? (
            <ModalBody>
              <FormControl isInvalid={checkError().err && !focused}>
                <FormLabel>File Name</FormLabel>
                <Input
                  value={input}
                  onChange={handleInputChange}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  autoFocus={true}
                />
                {checkError().err && !focused ? (
                  <FormErrorMessage>{checkError().errorMsg}</FormErrorMessage>
                ) : null}
              </FormControl>
            </ModalBody>
          ) : null}
          <ModalFooter>
            <Button
              colorScheme="blue"
              isDisabled={checkError().err}
              mr={3}
              onClick={handleSubmit}
            >
              Confirm
            </Button>
            <Button onClick={close}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
