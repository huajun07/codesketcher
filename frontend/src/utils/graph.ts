function isIntegerInRange(x: unknown, low: number, high: number) {
  return typeof x === 'number' && Number.isInteger(x) && x >= low && x <= high
}

function isArrayOfArrays<T>(array: unknown): array is T[][] {
  if (!Array.isArray(array)) return false
  for (const subarray of array) {
    if (!Array.isArray(subarray)) return false
  }
  return true
}

export function assertAdjacencyListUnweighted(
  adjacencyList: unknown,
): adjacencyList is number[][] {
  if (!isArrayOfArrays(adjacencyList)) return false
  const n = adjacencyList.length
  for (const list of adjacencyList) {
    for (const neighbour of list) {
      if (!isIntegerInRange(neighbour, 0, n - 1)) return false
    }
  }
  return true
}

export function assertAdjacencyListWeighted(
  adjacencyList: unknown,
): adjacencyList is [number, number][][] {
  if (!isArrayOfArrays(adjacencyList)) return false
  const n = adjacencyList.length
  for (const list of adjacencyList) {
    for (const item of list) {
      if (!Array.isArray(item) || item.length !== 2) return false
      const [neighbour, weight] = item
      if (typeof weight !== 'number') return false
      if (!isIntegerInRange(neighbour, 0, n - 1)) return false
    }
  }
  return true
}

export function assertAdjacencyMatrix(
  adjacencyMatrix: unknown,
): adjacencyMatrix is number[][] {
  if (!isArrayOfArrays(adjacencyMatrix)) return false
  const n = adjacencyMatrix.length
  for (const row of adjacencyMatrix) {
    if (row.length !== n) return false
    for (const weight of row) {
      if (typeof weight !== 'number') return false
    }
  }
  return true
}

export function adjacencyMatrixToList(
  adjacencyMatrix: number[][],
  weighted: boolean,
) {
  const n = adjacencyMatrix.length
  const adjacencyList: ([number, number] | number)[][] = []
  for (let u = 0; u < n; u++) {
    adjacencyList.push([])
    for (let v = 0; v < n; v++) {
      if (adjacencyMatrix[u][v] === 0) continue
      const weight = adjacencyMatrix[u][v]
      adjacencyList[u].push(weighted ? [v, weight] : v)
    }
  }
  return adjacencyList as number[][] | [number, number][][]
}
