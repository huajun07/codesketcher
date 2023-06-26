import { MdContentCopy } from 'react-icons/md'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Code,
  Heading,
  HStack,
  IconButton,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { useUserDataStore } from 'stores'
import { shallow } from 'zustand/shallow'

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

export const CodeExamples = (props: { toggle: () => void }) => {
  const { setCode, setInput, setIdx } = useUserDataStore(
    (state) => ({
      setCode: state.setCode,
      setInput: state.setInput,
      setIdx: state.setIdx,
    }),
    shallow,
  )
  return (
    <>
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
            <HStack spacing={0} marginBottom={2}>
              <Center>Code: </Center>
              <IconButton
                icon={<MdContentCopy />}
                aria-label="copy"
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(dijkstraInput)
                }}
              />
              <Spacer />
              <Button
                colorScheme="blue"
                onClick={() => {
                  setIdx(0)
                  setCode(dijkstraCode)
                  setInput(dijkstraInput)
                  props.toggle()
                }}
              >
                Load Code
              </Button>
            </HStack>
            <Code display="block" whiteSpace="pre">
              {dijkstraCode}
            </Code>
            <HStack spacing={0}>
              <Center>Input: </Center>
              <IconButton
                icon={<MdContentCopy />}
                aria-label="copy"
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(dijkstraInput)
                }}
              />
            </HStack>
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
    </>
  )
}
