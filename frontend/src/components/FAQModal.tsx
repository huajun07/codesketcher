import {
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
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Heading as="h3" size="lg" mt={4}>
            Getting started
          </Heading>
          <Text>
            Welcome to the graph visualization component of codesketcher!
          </Text>
          <Text>
            To get started, add a visualization by clicking the "+" icon.
            Visualizations are stored in tabs for easy navigation.
          </Text>

          <Heading as="h3" size="lg" mt={4}>
            Configuring a Graph Visualization
          </Heading>
          <Text>To display your graph, we need to configure a few things.</Text>

          <Heading as="h4" size="md" mt={2}>
            Edges
          </Heading>
          <Text>
            The edges should be stored inside a 0-indexed adjacency list or
            adjacency matrix.
          </Text>
          <Text mt={2}>
            If stored in an adjacency list, the format depends on whether the
            edges are weighted or not.
          </Text>
          <Text mt={2}>
            For an unweighted graph's adjacency list, it should be a{' '}
            <Code>list</Code>, where <Code>list[i]</Code> is another list
            containing all the neighbours of vertex <Code>i</Code>.
          </Text>
          <Text mt={2}>
            For a weighted graph's adjacency list, it should be a{' '}
            <Code>list</Code>, where <Code>list[i]</Code> is another list
            containing tuples/lists of the format <Code>(vertex, weight)</Code>,
            representing an edge to <Code>vertex</Code> with <Code>weight</Code>
            .
          </Text>
          <Text mt={2}>
            For a adjacency matrix, it should be a 2-dimensional{' '}
            <Code>list</Code> of size <Code>n x n</Code> (where <Code>n</Code>{' '}
            is the number of vertices). <Code>list[u][v]</Code> denotes the edge
            from vertex <Code>u</Code> to vertex <Code>v</Code>, which is{' '}
            <Code>0</Code> if there is no edge, or <Code>weight</Code> if there
            is an edge (<Code>weight</Code> is <Code>1</Code> if the graph is
            unweighted).
          </Text>

          <Heading as="h4" size="md" mt={2}>
            Graph Properties
          </Heading>
          <Text>
            Select whether the graph is directed/undirected and
            weighted/unweighted.
          </Text>

          <Heading as="h4" size="md" mt={2}>
            Display Data
          </Heading>
          <Text>
            Data about vertices can be displayed beside each vertex. Simply
            supply a <Code>list</Code> (of <Code>size n</Code>), and{' '}
            <Code>list[i]</Code> will be displayed by vertex <Code>i</Code>.
            This can be helpful to debug state changes as your algorithm runs
            (e.g. distance from source node in Dijkstra's Algorithm).
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
