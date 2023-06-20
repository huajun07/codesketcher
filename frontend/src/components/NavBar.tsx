import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { GoogleLogin } from '@react-oauth/google'
import { useUserDataStore } from 'stores'

export const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { name, picture, setCredentials, unSetCredentials, loggedIn } =
    useUserDataStore((state) => ({
      name: state.name,
      picture: state.picture,
      setCredentials: state.setCredentials,
      unSetCredentials: state.unSetCredentials,
      loggedIn: state.loggedIn,
    }))
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
            CodeSketcher
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

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar size={'sm'} src={picture} />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar bg="gray.100" size={'2xl'} src={picture} />
                  </Center>
                  <br />
                  <Center>
                    <p>{name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>

                  {!loggedIn ? (
                    <MenuItem>
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          try {
                            if (credentialResponse.credential)
                              setCredentials(credentialResponse.credential)
                            else throw Error('Login Error')
                          } catch (err) {
                            loginError()
                          }
                        }}
                        onError={loginError}
                      />
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={() => unSetCredentials()}>
                      Logout
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
