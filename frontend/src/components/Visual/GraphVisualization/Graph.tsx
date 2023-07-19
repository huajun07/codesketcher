import CytoscapeComponent from 'react-cytoscapejs'
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'

cytoscape.use(cola)

interface GraphProps {
  directed: boolean
  weighted: boolean
  adjacencyList: number[][] | [number, number][][]
  displayData: { name: string; array: string[] }[]
  cyRef: React.MutableRefObject<cytoscape.Core | null>
  locked: boolean
}

export const Graph = (props: GraphProps) => {
  const { directed, weighted, adjacencyList, displayData, cyRef, locked } =
    props

  const n = adjacencyList.length
  const elements: cytoscape.ElementDefinition[] = []
  for (let i = 0; i < n; i++) {
    const label = i.toString()
    const contents = []
    contents.push(label)
    for (const { name, array } of displayData) {
      if (array.length <= i) continue
      contents.push(`${name}: ${array[i]}`)
    }
    elements.push({
      group: 'nodes',
      data: {
        id: i.toString(),
        label,
        content: contents.join('\n'),
      },
    })
  }

  for (let i = 0; i < n; i++) {
    if (weighted) {
      for (const [v, weight] of adjacencyList[i] as [number, number][]) {
        elements.push({
          group: 'edges',
          data: {
            source: i.toString(),
            target: v.toString(),
            label: weight.toString(),
          },
        })
      }
    } else {
      for (const v of adjacencyList[i] as number[]) {
        elements.push({
          group: 'edges',
          data: {
            source: i.toString(),
            target: v.toString(),
          },
        })
      }
    }
  }

  return (
    <CytoscapeComponent
      cy={(cy) => (cyRef.current = cy)}
      elements={elements}
      layout={{ name: 'cola' }}
      style={{ height: '100%', width: '100%' }}
      userPanningEnabled={!locked}
      userZoomingEnabled={!locked}
      boxSelectionEnabled={!locked}
      stylesheet={[
        {
          selector: 'edge',
          style: {
            width: 4,
            ...(directed && {
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
            }),
            ...(weighted && {
              label: 'data(label)',
            }),
          },
        },
        {
          selector: 'node',
          style: {
            'border-color': 'black',
            'border-width': '1px',
            label: 'data(content)',
            'font-size': '0.75em',
            'text-wrap': 'wrap',
          },
        },
      ]}
    />
  )
}
