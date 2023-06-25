import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Code,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'

const dijkstraCode = `\
from heapq import heappush, heappop

# Number of vertices, number of edges
n, m = map(int, input().split(' '))
adj = [[] for _ in range(n)]

# Read edges in the format: vertex vertex weight
for i in range(m):
  u, v, w = map(int, input().split(' '))
  adj[u].append((v, w))
  adj[v].append((u, w))

distances = [-1 for _ in range(n)]
distances[0] = 0

# Run Dijkstra's algorithm from node 0 to find
# shortest distance to all nodes
pq = []
heappush(pq, (0, 0))
while len(pq) > 0:
  distance, u = heappop(pq)
  if distances[u] != distance:
    continue
  for (v, w) in adj[u]:
    if distances[v] != -1 and distances[v] < distance + w:
      continue
    distances[v] = distance + w
    heappush(pq, (distances[v], v))`

const dijkstraInput = `\
5 6
0 1 10
1 2 20
2 3 5
2 4 15
3 4 5
0 4 30`

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
                  <Box as="b" flex="1" textAlign="left">
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

                <Text>
                  For example, the following adjacency list will produce this
                  graph:
                </Text>

                <Code>adj = [ [1], [0, 2, 4], [1, 3, 4], [2], [1, 2], ]</Code>
                <br />
                <Center>
                  <Image
                    src="faq/unweighted_adj_list_settings.png"
                    alt="Unweighted adjacency list settings"
                    width="50%"
                    display="inline"
                  />
                  <Image
                    src="faq/unweighted_adj_list_graph.png"
                    alt="Unweighted adjacency list graph"
                    width="35%"
                    display="inline"
                    borderLeft="1px"
                    borderLeftColor="blackAlpha.400"
                    paddingLeft={4}
                  />
                </Center>
                <br />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <Text as="h3" size="md">
                <AccordionButton>
                  <Box as="b" flex="1" textAlign="left">
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
                  <Code>(vertex, weight)</Code> or <Code>[vertex, weight]</Code>
                  , representing an edge to <Code>vertex</Code> with{' '}
                  <Code>weight</Code>. Here we show an example of a directed,
                  weighted adjacency list.
                </Text>

                <Code>
                  adj = [ [(1, 5)], [(0, 10), (2, 1), [4, 3]], [[3, 7]], [], [],
                  ]
                </Code>
                <br />
                <Center>
                  <Image
                    src="faq/weighted_adj_list_settings.png"
                    alt="Weighted adjacency list settings"
                    width="50%"
                    display="inline"
                  />
                  <Image
                    src="faq/weighted_adj_list_graph.png"
                    alt="Weighted adjacency list graph"
                    width="35%"
                    display="inline"
                    borderLeft="1px"
                    borderLeftColor="blackAlpha.400"
                    paddingLeft={4}
                  />
                </Center>
                <br />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <Text as="h3" size="md">
                <AccordionButton>
                  <Box as="b" flex="1" textAlign="left">
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
                  graph is unweighted). Here we show an example of a weighted
                  adjacency matrix.
                </Text>

                <Code>adj = [ [0, 10, 20], [10, 0, 30], [20, 30, 0] ]</Code>
                <br />
                <Center>
                  <Image
                    src="faq/adj_matrix_settings.png"
                    alt="Adjacency matrix settings"
                    width="50%"
                    display="inline"
                  />
                  <Image
                    src="faq/adj_matrix_graph.png"
                    alt="Adjacency matrix graph"
                    width="35%"
                    display="inline"
                    borderLeft="1px"
                    borderLeftColor="blackAlpha.400"
                    paddingLeft={4}
                  />
                </Center>
                <br />
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
          <Center>
            <Image
              src="faq/graph_properties.png"
              width="50%"
              alt="Graph properties outline"
            />
          </Center>

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

          <Text mt={2}>
            In this example, we want to run some single-source shortest path
            algorithm on the adjacency matrix example, with vertex 0 as the
            source. If we have a <Code>distance</Code> list, then we can display
            it as such:
          </Text>

          <Code>distance = [0, -1, -1]</Code>
          <br />
          <Center>
            <Image
              src="faq/metadata_settings.png"
              alt="Metadata settings"
              width="40%"
            />
            <Image
              src="faq/metadata_graph.png"
              alt="Metadata graph"
              width="35%"
              borderLeft="1px"
              borderLeftColor="blackAlpha.400"
              paddingLeft={4}
            />
          </Center>
          <br />

          <Heading as="h3" size="lg" mt={4}>
            Code Examples
          </Heading>
          <Text>Here are some codes and inputs for you to try out!</Text>

          <Accordion defaultIndex={[]} allowMultiple mt={4}>
            <AccordionItem>
              <Text as="h4" size="md">
                <AccordionButton>
                  <Box as="b" flex="1" textAlign="left">
                    Dijkstra's Algorithm (Single Source Shortest Path)
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Text>
              <AccordionPanel pb={4}>
                <Code display="block" whiteSpace="pre">
                  {dijkstraCode}
                </Code>

                <Text mt={2}>Input:</Text>

                <Code display="block" whiteSpace="pre">
                  {dijkstraInput}
                </Code>
                <br />
                <Center>
                  <Image
                    src="faq/dijkstra_settings.png"
                    alt="Dijkstra settings"
                    width="50%"
                    display="inline"
                  />
                  <Image
                    src="faq/dijkstra_graph.png"
                    alt="Dijkstra graph"
                    width="35%"
                    display="inline"
                    borderLeft="1px"
                    borderLeftColor="blackAlpha.400"
                    paddingLeft={4}
                  />
                </Center>
                <br />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
