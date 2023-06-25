import { useState } from 'react'
import { AiFillCaretRight } from 'react-icons/ai'
import { BiSave } from 'react-icons/bi'
import { MdEdit } from 'react-icons/md'
import { AddIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useUserDataStore } from 'stores'
import { shallow } from 'zustand/shallow'

import { getErrorMessage } from 'utils/error'

import { CodeIDEModal } from './CodeIDEModals'

interface CodeIDEButtonProps {
  editing: boolean
  isDisabled: boolean
  toggleMode: () => void
}

export const CodeIDEButtons = (props: CodeIDEButtonProps) => {
  const {
    codenames,
    loggedIn,
    curIdx,
    setIdx,
    reload,
    update,
    loading,
    curFile,
    code,
    input,
  } = useUserDataStore(
    (state) => ({
      codenames: state.codenames,
      loggedIn: state.loggedIn,
      curIdx: state.curIdx,
      setIdx: state.setIdx,
      reload: state.reload,
      update: state.update,
      loading: state.loading,
      curFile: state.curFile,
      code: state.code,
      input: state.input,
    }),
    shallow,
  )
  const { isOpen, onToggle } = useDisclosure()
  const [variant, setVariant] = useState<'create' | 'rename' | 'delete'>(
    'create',
  )

  const toast = useToast()
  const triggerError = (msg: string) => {
    toast({
      title: 'Error!',
      description: msg,
      status: 'error',
      duration: 2000,
      isClosable: true,
    })
  }

  const createFunc = () => {
    setVariant('create')
    onToggle()
  }

  const deleteFunc = () => {
    setVariant('delete')
    onToggle()
  }

  const renameFunc = () => {
    setVariant('rename')
    onToggle()
  }

  const isDiff = code !== curFile.code || input !== curFile.input

  return (
    <>
      <CodeIDEModal
        variant={variant}
        open={isOpen}
        toggle={onToggle}
        triggerError={triggerError}
      />
      <Flex
        background={useColorModeValue('gray.100', 'gray.700')}
        minWidth="max-content"
        alignItems="center"
        gap="2"
        h="60px"
      >
        <Tooltip label={props.editing ? '' : 'Press the edit button to edit'}>
          <ButtonGroup isAttached variant="outline">
            <Menu>
              <MenuButton
                marginLeft={5}
                paddingX={2}
                borderRadius="md"
                borderWidth="1px"
                bg={
                  loggedIn && !loading && props.editing ? 'white' : 'gray.100'
                }
                cursor={
                  loggedIn && !loading && props.editing
                    ? 'pointer'
                    : 'not-allowed'
                }
                disabled={!loggedIn || loading || !props.editing}
              >
                <HStack>
                  <Text
                    fontSize="xs"
                    minW="120px"
                    maxW="120px"
                    align="left"
                    paddingX="3px"
                    noOfLines={1}
                  >
                    {loading
                      ? 'Loading...'
                      : loggedIn
                      ? codenames[curIdx]
                      : 'Login to save / load'}
                  </Text>
                  <ChevronDownIcon />
                </HStack>
              </MenuButton>
              <MenuList>
                {curIdx !== 0 && (
                  <>
                    <MenuItem onClick={() => setIdx(0)}>Clear Code</MenuItem>
                    <MenuDivider />
                  </>
                )}
                {codenames.length > 1 && (
                  <>
                    {codenames.slice(1).map((codename, index) => (
                      <MenuItem onClick={() => setIdx(index + 1)} key={index}>
                        {codename}
                      </MenuItem>
                    ))}
                    <MenuDivider />
                  </>
                )}
                <MenuItem icon={<AddIcon />} onClick={createFunc}>
                  New File
                </MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={IconButton}
                bg={props.editing ? 'white' : 'gray.100'}
                isDisabled={!props.editing}
                cursor={props.editing ? 'pointer' : 'not-allowed'}
              >
                <Center>
                  <HamburgerIcon />
                </Center>
              </MenuButton>
              <MenuList>
                {curIdx !== 0 && (
                  <>
                    <MenuItem onClick={renameFunc}>Rename</MenuItem>
                    <MenuItem onClick={reload}>Reload</MenuItem>
                    <MenuItem onClick={deleteFunc}>Delete</MenuItem>
                  </>
                )}
                <MenuItem>Share</MenuItem>
                <MenuItem>Download</MenuItem>
              </MenuList>
            </Menu>
          </ButtonGroup>
        </Tooltip>
        {loggedIn ? (
          <Tooltip label={isDiff && 'Save your code and input'}>
            <IconButton
              variant="ghost"
              colorScheme="teal"
              isDisabled={!isDiff}
              icon={<BiSave size={32} />}
              aria-label="save"
              onClick={
                curIdx === 0
                  ? createFunc
                  : () => {
                      update()
                        .then()
                        .catch((err) => {
                          triggerError(getErrorMessage(err))
                        })
                    }
              }
            />
          </Tooltip>
        ) : null}
        <Spacer />
        <Tooltip
          label={
            props.editing
              ? 'Paste the code below and run it!'
              : 'Stop the simulation and edit your code'
          }
        >
          <Button
            margin="10px"
            rightIcon={<Icon as={props.editing ? AiFillCaretRight : MdEdit} />}
            colorScheme="blue"
            variant="solid"
            onClick={props.toggleMode}
            isDisabled={props.isDisabled}
          >
            {props.editing ? 'Run' : 'Edit'}
          </Button>
        </Tooltip>
      </Flex>
    </>
  )
}
