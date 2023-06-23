import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Code,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'

interface FAQModalProps {
  open: boolean
  toggle: () => void
}

export const FAQModal = (props: FAQModalProps) => {
  const { open, toggle } = props
  return (
    <Modal isOpen={open} onClose={toggle}>
      <ModalOverlay />
      <ModalContent maxW="1000px" py={8}>
        <ModalCloseButton />
        <ModalBody>
          <Heading as="h3" size="lg">
            Getting started
          </Heading>
          <Text>
            Welcome to the graph visualization component of codesketcher!
          </Text>
          <Text>
            To get started, add a visualization by clicking the <Code>+</Code>{' '}
            icon. Visualizations are stored in tabs for easy navigation.
          </Text>

          <Heading as="h3" size="lg" mt={4}>
            Configuring a Graph Visualization
          </Heading>
          <Text>To display your graph, we need to configure a few things.</Text>

          <Heading as="h4" size="md" mt={4}>
            Edges
          </Heading>

          <Text>
            You need to enter the name of your variable containing all the
            edges. Note that the data must be 0-indexed (i.e. vertices are
            labelled <Code>0</Code> to <Code>n - 1</Code>). The number of
            vertices, <Code>n</Code>, is automatically inferred from the size of
            the adjacency list/matrix. A few formats are supported for the edge
            variable:
          </Text>

          <Accordion defaultIndex={[]} allowMultiple mt={4}>
            <AccordionItem>
              <Text as="h3" size="md">
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Unweighted adjacency list
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Text>
              <AccordionPanel pb={4}>
                <Text>
                  For an unweighted graph's adjacency list, the variable should
                  be a <Code>list</Code>, where <Code>list[i]</Code> is another
                  list containing all the neighbours of vertex <Code>i</Code>.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <Text as="h3" size="md">
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Weighted adjacency list
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Text>
              <AccordionPanel pb={4}>
                <Text>
                  For a weighted graph's adjacency list, it should be a{' '}
                  <Code>list</Code>, where <Code>list[i]</Code> is another list
                  containing tuples/lists of the format{' '}
                  <Code>(vertex, weight)</Code>, representing an edge to{' '}
                  <Code>vertex</Code> with <Code>weight</Code>.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <Text as="h3" size="md">
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Adjacency matrix
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Text>
              <AccordionPanel pb={4}>
                <Text>
                  For an adjacency matrix, it should be a 2-dimensional{' '}
                  <Code>list</Code> of size <Code>n x n</Code> (where{' '}
                  <Code>n</Code> is the number of vertices).{' '}
                  <Code>list[u][v]</Code> denotes the edge from vertex{' '}
                  <Code>u</Code> to vertex <Code>v</Code>, which is{' '}
                  <Code>0</Code> if there is no edge, or <Code>weight</Code> if
                  there is an edge (<Code>weight</Code> is <Code>1</Code> if the
                  graph is unweighted).
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Heading as="h4" size="md" mt={4}>
            Graph Properties
          </Heading>
          <Text>
            Select whether the graph is directed/undirected and
            weighted/unweighted.
          </Text>

          <Heading as="h4" size="md" mt={2}>
            Vertex Metadata
          </Heading>
          <Text>
            Data about vertices can be displayed beside each vertex. Simply
            supply a <Code>list</Code> (of size <Code>n</Code>), and{' '}
            <Code>list[i]</Code> will be displayed by vertex <Code>i</Code>.
            This can be helpful to debug state changes as your algorithm runs
            (e.g. distance from the source node in Dijkstra's Algorithm).
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
