import { useCallback, useLayoutEffect, useState } from 'react'

const getHeight = (node: HTMLElement) => {
  const rect = node.getBoundingClientRect()

  return rect.height
}

const BASE_ROW_HEIGHT = 48
const TABLE_HEADER_HEIGHT = 36
const EMPTY_STATE_SIZE = 5 * BASE_ROW_HEIGHT

export function calculateTableHeight(
  rowHeight: number,
  tableSize: number,
  headless?: boolean
): number {
  const multiplicator = Boolean(tableSize) ? tableSize * rowHeight : EMPTY_STATE_SIZE
  return (headless ? 0 : TABLE_HEADER_HEIGHT) + multiplicator
}

const useDynamicMeasures = ({ lenght, headless }: { lenght: number; headless?: boolean }) => {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [tableHeight, setTableHeight] = useState(
    calculateTableHeight(BASE_ROW_HEIGHT, lenght, headless)
  )

  const ref = useCallback((element: HTMLElement) => {
    setNode(element)
  }, [])

  const measure = (bodyNode: HTMLElement) => {
    window.requestAnimationFrame(() => {
      const bodyHeight = getHeight(bodyNode)
      const newHeight = bodyHeight >= BASE_ROW_HEIGHT ? bodyHeight : EMPTY_STATE_SIZE
      setTableHeight(newHeight + TABLE_HEADER_HEIGHT)
    })
  }

  useLayoutEffect(() => {
    if (!node) {
      return
    }
    measure(node)

    window.addEventListener('resize', () => measure(node))

    return () => {
      window.removeEventListener('resize', () => measure(node))
    }
  }, [node])

  return {
    measures: { tableHeight, rowHeight: 'auto' },
    ref,
    triggerResize: node ? () => measure(node) : () => {},
  }
}

export default useDynamicMeasures
