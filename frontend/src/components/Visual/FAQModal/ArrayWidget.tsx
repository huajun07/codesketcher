import { Center, Heading, Image, Text } from '@chakra-ui/react'

export const ArrayWidget = () => {
  return (
    <>
      <Heading as="h3" size="lg" mt={4}>
        Configuring an Array Visualization
      </Heading>

      <Text>
        To display an array, type its variable name into the text box.
      </Text>
      <Center>
        <Image
          src="faq/array_1d.png"
          alt="1 dimensional array"
          width="30%"
          display="inline"
        />
      </Center>

      <Text>For 2-dimensional arrays, tick the checkbox.</Text>
      <Center>
        <Image
          src="faq/array_2d.png"
          alt="2 dimensional array"
          width="30%"
          display="inline"
        />
      </Center>
    </>
  )
}
