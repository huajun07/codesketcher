import './Moveable.css'

import { useRef, useState } from 'react'
import { PiGraph } from 'react-icons/pi'
import Moveable from 'react-moveable'
import Selecto from 'react-selecto'
import { InfoIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Tooltip } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'

import { FAQModal } from './FAQModal'
import { GraphVisualization } from './GraphVisualization'
import styles from './VisualArea.module.css'

export const VisualArea = () => {
  const moveableRef = useRef<Moveable>(null)
  const [selectedTargets, setSelectedTargets] = useState<
    (HTMLElement | SVGElement)[]
  >([])

  const [faqOpen, setFAQOpen] = useState(false)

  const [childKeys, setChildKeys] = useState<string[]>([])

  const eraseVisualization = (key: string) => {
    const index = childKeys.findIndex((x) => x === key)
    if (index === -1) return
    setChildKeys(childKeys.filter((x) => x !== key))
    setSelectedTargets(selectedTargets.filter((x) => x.dataset.key !== key))
  }

  const addVisualization = () => {
    setChildKeys([...childKeys, uuidv4()])
  }

  return (
    <>
      <Flex direction="column" w="full">
        <FAQModal open={faqOpen} toggle={() => setFAQOpen(!faqOpen)} />
        <Flex>
          <Tooltip label="FAQ">
            <Button borderRadius={0} onClick={() => setFAQOpen(true)}>
              <InfoIcon />
            </Button>
          </Tooltip>
          <Tooltip label="Add a graph">
            <Button borderRadius={0} onClick={() => addVisualization()}>
              <PiGraph />
            </Button>
          </Tooltip>
        </Flex>

        <Box
          flexGrow={1}
          position="relative"
          overflow="hidden"
          id="visual-area-container"
          bgColor="gray.50"
        >
          {childKeys.map((key) => (
            <div
              key={key}
              className={'visual-component ' + styles['visual-component']}
              style={{ height: 300, width: 400, backgroundColor: 'white' }}
              data-key={key}
            >
              <GraphVisualization
                erase={() => eraseVisualization(key)}
                selected={selectedTargets.some((x) => x.dataset.key === key)}
              />
            </div>
          ))}
          <Moveable
            ref={moveableRef}
            target={selectedTargets}
            individualGroupable
            draggable
            onDrag={({ target, transform }) => {
              target.style.transform = transform
            }}
            resizable
            onResize={({ target, width, height, delta, drag }) => {
              target.style.transform = drag.transform
              delta[0] && (target.style.width = `${width}px`)
              delta[1] && (target.style.height = `${height}px`)
            }}
          />
          <Selecto
            dragContainer={'#visual-area-container'}
            selectFromInside={false}
            selectByClick={true}
            selectableTargets={['.visual-component-move-button']}
            onDragStart={(event) => {
              event.preventDrag()
              const moveable = moveableRef.current
              if (moveable === null) return
              const target = event.inputEvent.target
              if (
                moveable.isMoveableElement(target) ||
                selectedTargets.some((t) => t === target || t.contains(target))
              ) {
                event.stop()
              }
            }}
            onSelectEnd={(event) => {
              const moveable = moveableRef.current
              if (moveable === null) return
              if (event.isDragStartEnd) {
                event.inputEvent.preventDefault()
                moveable.waitToChangeTarget().then(() => {
                  moveable.dragStart(event.inputEvent)
                })
              }
              setSelectedTargets(
                event.selected.map((x) => {
                  let root = x
                  while (root.dataset.key === undefined)
                    root = root.parentElement as HTMLElement
                  return root
                }),
              )
            }}
          />
        </Box>
      </Flex>
    </>
  )
}
