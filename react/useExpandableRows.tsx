import { useState, useEffect, useMemo } from 'react'

export type IdMap = Record<string, boolean> | undefined

export default function useExpandableRows(props: { items: Array<{ id: string }> }) {
  const idsSummarizedString = props.items.reduce(
    (acc: string, currentItem) => `${acc}.${currentItem.id}`,
    ''
  )
  const itemsQuant = props.items.length

  const [expandedRowsAmount, setExpandedRowsAmount] = useState(0)
  const [isRowExpandedMap, setIsRowExpandedMap] = useState<IdMap>()

  const allExpandedMap = useMemo(() => {
    return props.items.reduce(
      (acc: IdMap, currentItem) => ({
        ...acc,
        [currentItem.id]: true,
      }),
      {}
    )
    // since props.items is an array and useMemo doesn't perform
    // deep compare idsSummarizedString is replacing props.items here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsSummarizedString])

  useEffect(() => {
    setIsRowExpandedMap({})
    // since props.items is an array and useEffect doesn't perform
    // deep compare idsSummarizedString is replacing props.items here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsSummarizedString])

  const toggleRow = (id: string) => {
    if (!isRowExpandedMap || !isRowExpandedMap[id]) {
      setExpandedRowsAmount(current => current + 1)
    } else {
      setExpandedRowsAmount(current => current - 1)
    }

    setIsRowExpandedMap(currentMap => ({
      ...currentMap,
      [id]: currentMap ? !currentMap[id] : false,
    }))
  }

  const expandAll = () => {
    setIsRowExpandedMap(allExpandedMap)
    setExpandedRowsAmount(itemsQuant)
  }

  const collapseAll = () => {
    setIsRowExpandedMap({})
    setExpandedRowsAmount(0)
  }

  return {
    toggleExpandRow: toggleRow,
    isRowExpandedMap,
    expandAll,
    collapseAll,
    expandedRowsAmount,
  }
}
