import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { GoogleLogin } from '@react-oauth/google'
import { useUserDataStore } from 'stores'
import { shallow } from 'zustand/shallow'

export const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { name, picture, setCredentials, unSetCredentials, loggedIn } =
    useUserDataStore(
      (state) => ({
        name: state.name,
        picture: state.picture,
        setCredentials: state.setCredentials,
        unSetCredentials: state.unSetCredentials,
        loggedIn: state.loggedIn,
      }),
      shallow,
    )
  const toast = useToast()
  const loginError = () => {
    toast({
      title: 'Login Error!',
      description: 'Please try again later',
      status: 'error',
      duration: 2000,
      isClosable: true,
    })
  }
  return (
    <>
      <Box
        bg={useColorModeValue('blue.100', 'blue.900')}
        px={4}
        minW="1500px"
        h="65px"
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Heading color={useColorModeValue('blue.700', 'blue.300')}>
            CodeSketcher Test
          </Heading>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button
                display="none"
                onClick={toggleColorMode}
                bg={useColorModeValue('blue.100', 'blue.900')}
                _hover={{ bg: useColorModeValue('blue.200', 'blue.800') }}
              >
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              {loggedIn ? (
                <Menu>
                  <MenuButton
                    h={16}
                    as={Button}
                    variant={'ghost'}
                    cursor={'pointer'}
                    minW={0}
                    borderRadius={0}
                    rightIcon={<ChevronDownIcon />}
                  >
                    <HStack>
                      <Text color="blue.700" fontSize="sm">
                        {name}
                      </Text>
                      <Avatar size={'sm'} src={picture} />
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => unSetCredentials()}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      if (credentialResponse.credential)
                        await setCredentials(credentialResponse.credential)
                      else throw Error('Login Error')
                    } catch (err) {
                      loginError()
                    }
                  }}
                  onError={loginError}
                />
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
