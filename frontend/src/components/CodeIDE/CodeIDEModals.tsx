import { useContext, useState } from 'react'
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
  Tooltip,
} from '@chakra-ui/react'
import { useUserDataStore } from 'stores'
import { shallow } from 'zustand/shallow'

import { getErrorMessage } from 'utils/error'

import { LoaderContext } from 'pages/Main'

interface ModalProps {
  variant: 'create' | 'rename' | 'delete' | 'save'
  open: boolean
  toggle: () => void
  triggerError: (message: string) => void
}

export const CodeIDEModal = (props: ModalProps) => {
  const { create, rename, drop, codenames, curIdx } = useUserDataStore(
    (state) => ({
      create: state.create,
      rename: state.rename,
      drop: state.drop,
      codenames: state.codenames,
      curIdx: state.curIdx,
    }),
    shallow,
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
    toggle()
    setInput('')
  }

  const action = async () => {
    if (variant === 'create') return await create(input)
    if (variant === 'save') return await create(input, true)
    if (variant === 'rename') return await rename(input)
    if (variant === 'delete') return await drop()
  }

  const setLoading = useContext(LoaderContext) as React.Dispatch<
    React.SetStateAction<boolean>
  >

  const handleSubmit = () => {
    setFocused(true) // To prevent error from showing
    setLoading(true)
    action()
      .then(() => {
        close()
        setLoading(false)
      })
      .catch((err) => {
        triggerError(getErrorMessage(err))
        close()
        setLoading(false)
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
          {variant !== 'delete' && (
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
                {checkError().err && !focused && (
                  <FormErrorMessage>{checkError().errorMsg}</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>
          )}
          <ModalFooter>
            <Tooltip
              label={
                checkError().err && variant !== 'delete'
                  ? checkError().errorMsg
                  : ''
              }
            >
              <Button
                colorScheme="blue"
                isDisabled={checkError().err && variant !== 'delete'}
                mr={3}
                onClick={handleSubmit}
              >
                Confirm
              </Button>
            </Tooltip>
            <Button onClick={close}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
