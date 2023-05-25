import { FaBackward, FaForward, FaPause, FaPlay } from 'react-icons/fa'
import {
  Box,
  Flex,
  IconButton,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

interface ControlBarProps {
  curIdx: number
  playing: boolean
  length: number
  curSpeed: number
}

export const ControlBar = (props: ControlBarProps) => {
  const buttonColor = useColorModeValue('#3182ce', '#90cdf4')
  return (
    <>
      <Flex flexDirection="column">
        <Box px="15px" py="0px">
          <Slider
            value={props.curIdx}
            min={0}
            max={props.length}
            step={1}
            size="lg"
          >
            <SliderTrack>
              <Box position="relative" right={10} />
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </Box>
        <Flex>
          <Stack direction="row" align="center" px="10px">
            <Text> Speed</Text>
            <Input value={props.curSpeed} w="60px" textAlign="center" />
          </Stack>
          <Spacer />
          <Stack direction="row" align="center">
            <IconButton
              isRound={true}
              background="none"
              size="lg"
              aria-label="Rewind"
              icon={<FaBackward color={buttonColor} />}
            />
            <IconButton
              isRound={true}
              background="none"
              size="lg"
              aria-label="Play/Pause"
              icon={
                props.playing ? (
                  <FaPause color={buttonColor} />
                ) : (
                  <FaPlay color={buttonColor} />
                )
              }
            />
            <IconButton
              isRound={true}
              background="none"
              size="lg"
              aria-label="Forward"
              icon={<FaForward color={buttonColor} />}
            />
          </Stack>
          <Spacer />
          <Stack direction="row" align="center" px="10px">
            <Text> Step</Text>
            <Input value={props.curIdx} w="60px" textAlign="center" />
          </Stack>
        </Flex>
      </Flex>
    </>
  )
}
