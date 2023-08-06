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

/**
 * Check that given object is a unweighted adjacency list
 * @param adjacencyList Object
 * @returns Boolean True if object is unweighted adjacency list
 * @example
 * // returns false - node 2 not found
 * assertAdjacencyListUnweighted([[0, 2], []])
 * @example
 * // returns true
 * assertAdjacencyListUnweighted([[0, 2], [], [1, 0, 2]])
 */
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

/**
 * Check that given object is a weighted adjacency list
 * @param adjacencyList Object
 * @returns Boolean True if object is weighted adjacency list
 * @example
 * // returns false - unweighted
 * assertAdjacencyListWeighted([[0, 2], [], [1, 0, 2]])
 * @example
 * // returns true
 * assertAdjacencyListWeighted([[[0, 11], [2, -3]], [], [[1, 5], [0, 0], [2, -6]]])
 */
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

/**
 * Check that given object is an adjacency matrix
 * @param adjacencyMatrix Object
 * @returns Boolean True if object is adjacency matrix
 * @example
 * // returns false - incorrect size (Not n x n)
 * assertAdjacencyMatrix([[1, 0, 1], [0, 0], [0, 1, 1]])
 * @example
 * // returns false - Item not number
 * assertAdjacencyMatrix([[1, 'hi', 1], [0, 0, 1], [0, 1, 1]])
 * @example
 * // returns true
 * assertAdjacencyMatrix([[1, 5, 1], [0, 2, 1], [3, 1, 1]])
 */
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

/**
 * Convert the given adjacency matrix to adjacency list
 * @param adjacencyMatrix Given matrix
 * @param weighted Whether adj matrix is weighted
 * @returns The converted adj list
 * @example
 * // returns [[0, 2], [], [0, 1, 2]]
 * adjacencyMatrixToList([[1, 0, 1], [0, 0, 0], [1, 1, 1]], false)
 * @example
 * // returns [[[0, 11], [2, -3]], [], [[0, 2], [1, 5], [2, -6]]]
 * adjacencyMatrixToList([[11, 0, -3], [0, 0, 0], [2, 5, -6]], true)
 */
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
