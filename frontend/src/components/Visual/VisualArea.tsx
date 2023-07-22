import './Moveable.css'

import { useRef, useState } from 'react'
import { MdDataArray } from 'react-icons/md'
import { PiGraph } from 'react-icons/pi'
import Moveable from 'react-moveable'
import Selecto from 'react-selecto'
import { InfoIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Tooltip } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'

import { ArrayVisualization } from './ArrayVisualization'
import { FAQModal } from './FAQModal'
import { GraphVisualization } from './GraphVisualization'
import styles from './VisualArea.module.css'

export const VisualArea = () => {
  const moveableRef = useRef<Moveable>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedTargets, setSelectedTargets] = useState<
    (HTMLElement | SVGElement)[]
  >([])

  const [faqOpen, setFAQOpen] = useState(false)

  enum VisualizationType {
    Graph = 'graph',
    Array = 'array',
  }
  const [visualizations, setVisualizations] = useState<
    {
      key: string
      type: VisualizationType
    }[]
  >([])

  const eraseVisualization = (key: string) => {
    setVisualizations(visualizations.filter((x) => x.key !== key))
    setSelectedTargets(selectedTargets.filter((x) => x.dataset.key !== key))
  }

  const addVisualization = (type: VisualizationType) => {
    setVisualizations([
      ...visualizations,
      {
        key: uuidv4(),
        type,
      },
    ])
  }

  const boundTranslate = (target: HTMLElement, transform: string) => {
    let [x, y] = transform
      .slice('translate('.length + 1, -2)
      .split(',')
      .map((s) => Number.parseInt(s.trim().slice(0, -2)))
    x = Math.max(x, 0)
    y = Math.max(y, 0)
    if (containerRef.current !== null) {
      x = Math.min(x, containerRef.current.offsetWidth - target.offsetWidth)
      y = Math.min(y, containerRef.current.offsetHeight - target.offsetHeight)
    }
    return `translate(${x}px, ${y}px)`
  }

  return (
    <>
      <Flex direction="column" w="full">
        <FAQModal open={faqOpen} toggle={() => setFAQOpen(!faqOpen)} />
        <Flex bgColor="gray.100">
          <Tooltip label="FAQ">
            <Button
              aria-label="faq"
              borderRadius={0}
              onClick={() => setFAQOpen(true)}
              borderRight="1px solid"
              borderRightColor="gray.300"
            >
              <InfoIcon />
            </Button>
          </Tooltip>
          <Tooltip label="Add a graph">
            <Button
              aria-label="add graph"
              borderRadius={0}
              onClick={() => addVisualization(VisualizationType.Graph)}
              borderRight="1px solid"
              borderRightColor="gray.300"
            >
              <PiGraph />
            </Button>
          </Tooltip>
          <Tooltip label="Add an array">
            <Button
              aria-label="add array"
              borderRadius={0}
              onClick={() => addVisualization(VisualizationType.Array)}
              borderRight="1px solid"
              borderRightColor="gray.300"
            >
              <MdDataArray />
            </Button>
          </Tooltip>
        </Flex>

        <Box
          ref={containerRef}
          flexGrow={1}
          position="relative"
          overflow="hidden"
          id="visual-area-container"
          bgColor="gray.50"
        >
          {visualizations.map(({ key, type }) => {
            const isSelected = selectedTargets.some(
              (x) => x.dataset.key === key,
            )
            return (
              <Box
                className={
                  'visual-component ' +
                  styles['visual-component'] +
                  ` ${styles['visual-component-' + type]} ` +
                  (isSelected ? ` ${styles['visual-component-selected']}` : '')
                }
                height={300}
                width={400}
                bgColor="white"
                border="2px solid"
                padding={1}
                borderColor="black.100"
                borderRadius={8}
                data-key={key}
              >
                {type === VisualizationType.Graph ? (
                  <GraphVisualization
                    erase={() => eraseVisualization(key)}
                    selected={isSelected}
                  />
                ) : type === VisualizationType.Array ? (
                  <ArrayVisualization erase={() => eraseVisualization(key)} />
                ) : (
                  <></>
                )}
              </Box>
            )
          })}
          <Moveable
            ref={moveableRef}
            target={selectedTargets}
            individualGroupable
            draggable
            onDrag={({ target, transform }) => {
              target.style.transform = boundTranslate(
                target as HTMLElement,
                transform,
              )
            }}
            resizable
            onResize={({ target, width, height, delta, drag }) => {
              target.style.transform = boundTranslate(
                drag.target as HTMLElement,
                drag.transform,
              )
              delta[0] && (target.style.width = `${width}px`)
              delta[1] && (target.style.height = `${height}px`)
            }}
          />
          <Selecto
            dragContainer={'#visual-area-container'}
            selectFromInside={false}
            selectByClick={true}
            selectableTargets={['.visual-component']}
            onDragStart={(event) => {
              event.preventDrag()
              const moveable = moveableRef.current
              if (moveable === null) return
              const target = event.inputEvent.target as HTMLElement
              if (
                moveable.isMoveableElement(target) ||
                selectedTargets.some((t) => t === target || t.contains(target))
              ) {
                event.stop()
              }
              const isChildOfSelectable = (
                element: HTMLElement | null,
              ): boolean => {
                if (element === document.body || element === null) return false
                if (element.classList.contains('visual-component')) return true
                return isChildOfSelectable(element.parentElement)
              }
              if (isChildOfSelectable(target.parentElement)) event.stop()
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
              setSelectedTargets(event.selected)
            }}
          />
        </Box>
      </Flex>
    </>
  )
}
