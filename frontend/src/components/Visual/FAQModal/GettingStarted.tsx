import { Center, Heading, Image, Text } from '@chakra-ui/react'

export const GettingStarted = () => {
  return (
    <>
      <Heading as="h3" size="lg">
        Getting started
      </Heading>
      <Text>Welcome to the visualization component of CodeSketcher!</Text>
      <Text>
        To get started, add a graph / array visualization widget by clicking on
        these buttons in the toolbar:
      </Text>
      <Center>
        <Image
          src="faq/add_graph_button.png"
          alt="Add graph widget button"
          width="15%"
          display="inline"
        />
        <Image
          src="faq/add_array_button.png"
          alt="Add array widget button"
          width="15%"
          display="inline"
          marginLeft={4}
        />
      </Center>

      <Heading as="h3" size="lg" mt={4}>
        Visualization Widgets
      </Heading>
      <Text>
        Each widget can be dragged around and resized. Simply click on the
        widget's border to select it and enable movement/resizing. Once done,
        click anywhere outside the widget to de-select it.
      </Text>
      <Center>
        <Image
          src="faq/unconfigured_graph.png"
          alt="Unconfigured graph widget"
          width="40%"
          display="inline"
        />
        <Image
          src="faq/unconfigured_array.png"
          alt="Unconfigured array widget"
          width="40%"
          display="inline"
          marginLeft={4}
        />
      </Center>
      <Text>
        Individual widgets can be deleted by pressing the delete button at the
        top right of each widget.
      </Text>

      <Heading as="h3" size="lg" mt={4}>
        Widget Types
      </Heading>
      <Text>
        There are 2 types of widgets - graph, and array. Visit the next 2 tabs
        to learn how to configure them.
      </Text>

      <Heading as="h3" size="lg" mt={4}>
        Code Examples
      </Heading>
      <Text>
        We have provided some code examples in the last tab, use those to get
        started!
      </Text>
    </>
  )
}
