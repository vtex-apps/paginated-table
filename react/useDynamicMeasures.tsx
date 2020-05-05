import { useState, useCallback, useLayoutEffect } from 'react'

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
  const multiplicator = tableSize !== 0 ? tableSize : EMPTY_STATE_SIZE
  return (headless ? 0 : TABLE_HEADER_HEIGHT) + rowHeight * multiplicator
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
    window.requestAnimationFrame(() => setTableHeight(getHeight(bodyNode) + TABLE_HEADER_HEIGHT))
  }

  useLayoutEffect(() => {
    if (!node) {
      return
    }
    // const measure = () =>
    //   window.requestAnimationFrame(() =>
    //     setTableHeight(getHeight(node) + TABLE_HEADER_HEIGHT)
    //   )
    measure(node)

    window.addEventListener('resize', () => measure(node))

    return () => {
      window.removeEventListener('resize', () => measure(node))
    }
  }, [node])

  return {
    ref,
    measures: { tableHeight },
    triggerResize: node ? () => measure(node) : () => {},
  }
}

export default useDynamicMeasures
