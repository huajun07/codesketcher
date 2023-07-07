import { CopyIcon } from '@chakra-ui/icons'
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  useToast,
} from '@chakra-ui/react'
import { useUserDataStore } from 'stores'
import { shallow } from 'zustand/shallow'

import { getErrorMessage } from 'utils/error'

interface ModalProps {
  open: boolean
  toggle: () => void
  triggerError: (message: string) => void
}

export const CodeShareModal = (props: ModalProps) => {
  const { genId, shareId } = useUserDataStore(
    (state) => ({
      shareId: state.shareId,
      genId: state.genId,
    }),
    shallow,
  )
  const shareLink = shareId ? window.location.href + '?id=' + shareId : null
  const { open, toggle, triggerError } = props
  const toast = useToast()

  const gen = () => {
    genId()
      .then(() => {
        toast({
          title: 'Share Link Generated',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      })
      .catch((err) => {
        triggerError(getErrorMessage(err))
      })
  }
  return (
    <>
      <Modal isOpen={open} onClose={toggle}>
        <ModalContent>
          <ModalHeader>Share Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                value={shareLink || 'No Share Link'}
                cursor="auto"
                isDisabled={!shareLink}
                readOnly
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  icon={<CopyIcon />}
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="copy"
                  isDisabled={!shareLink}
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink || '')
                  }}
                />
              </InputRightElement>
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={gen}>
              {shareId ? 'Create New Link' : 'Create Link'}
            </Button>
            <Spacer />
            <Button onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
