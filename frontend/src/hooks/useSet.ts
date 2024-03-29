import { useRef, useState } from 'react'

/**
 * Custom hook to allow useState of a set
 * @template T
 * @param {T[]} initialSet
 * @returns A set with getters and setters wrapped with useState
 */
export function useSet<T>(initialSet: T[] = []) {
  const setRef = useRef(new Set(initialSet))
  const [toggle, rerender] = useState(false)

  const set = {
    add: (value: T): void => {
      setRef.current.add(value)
      rerender(!toggle)
    },
    delete: (value: T): void => {
      setRef.current.delete(value)
      rerender(!toggle)
    },
    has: (value: T): boolean => setRef.current.has(value),
  }

  return set
}
