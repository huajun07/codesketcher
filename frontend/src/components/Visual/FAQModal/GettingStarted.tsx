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
  Text,
} from '@chakra-ui/react'

export const GettingStarted = ({
  initialIndexes,
}: {
  initialIndexes?: number[]
}) => {
  return (
    <>
      <Heading as="h3" size="lg">
        Getting started
      </Heading>
      <Text>Welcome to the graph visualization component of codesketcher!</Text>
      <Text>
        To get started, add a visualization by clicking the <Code>+</Code> icon.
        Visualizations are stored in tabs for easy navigation.
      </Text>

      <Heading as="h3" size="lg" mt={4}>
        Configuring a Graph Visualization
      </Heading>
      <Text>To display your graph, we need to configure a few things.</Text>

      <Heading as="h4" size="md" mt={4}>
        Edges
      </Heading>

      <Text>
        You need to enter the name of your variable containing all the edges.
        Note that the data must be 0-indexed (i.e. vertices are labelled{' '}
        <Code>0</Code> to <Code>n - 1</Code>). The number of vertices,{' '}
        <Code>n</Code>, is automatically inferred from the size of the adjacency
        list/matrix. A few formats are supported for the edge variable:
      </Text>

      <Accordion defaultIndex={initialIndexes || []} allowMultiple mt={4}>
        <AccordionItem>
          <Text as="h5" size="md">
            <AccordionButton>
              <Box as="b" flex="1" textAlign="left">
                Unweighted adjacency list
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Text>
          <AccordionPanel pb={4}>
            <Text>
              For an unweighted graph's adjacency list, the variable should be a{' '}
              <Code>list</Code>, where <Code>list[i]</Code> is another list
              containing all the neighbours of vertex <Code>i</Code>.
            </Text>

            <Text>
              For example, the following adjacency list will produce this graph:
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
          <Text as="h5" size="md">
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
              <Code>(vertex, weight)</Code> or <Code>[vertex, weight]</Code>,
              representing an edge to <Code>vertex</Code> with{' '}
              <Code>weight</Code>. Here we show an example of a directed,
              weighted adjacency list.
            </Text>

            <Code>
              adj = [ [(1, 5)], [(0, 10), (2, 1), [4, 3]], [[3, 7]], [], [], ]
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
          <Text as="h5" size="md">
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
              <Code>list</Code> of size <Code>n x n</Code> (where <Code>n</Code>{' '}
              is the number of vertices). <Code>list[u][v]</Code> denotes the
              edge from vertex <Code>u</Code> to vertex <Code>v</Code>, which is{' '}
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
        Select whether the graph is directed/undirected and weighted/unweighted.
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
        Data about vertices can be displayed beside each vertex. Simply supply a{' '}
        <Code>list</Code> (of size <Code>n</Code>), and <Code>list[i]</Code>{' '}
        will be displayed by vertex <Code>i</Code>. This can be helpful to debug
        state changes as your algorithm runs (e.g. distance from the source node
        in Dijkstra's Algorithm).
      </Text>

      <Text mt={2}>
        In this example, we want to run some single-source shortest path
        algorithm on the adjacency matrix example, with vertex 0 as the source.
        If we have a <Code>distance</Code> list, then we can display it as such:
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
    </>
  )
}
