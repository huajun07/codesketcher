import { ChakraProvider } from '@chakra-ui/react'

import { theme } from 'theme'
import { NavBar } from 'components'

import { Router } from './Router'

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <NavBar />
      <Router />
    </ChakraProvider>
  )
}
