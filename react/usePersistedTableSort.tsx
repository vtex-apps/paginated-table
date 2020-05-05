import { EXPERIMENTAL_useTableSort as useTableSort } from 'vtex.styleguide'
import { useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'

const reverse = (order: string) => {
  if (order === 'DSC') {
    return 'ASC'
  }
  return 'DSC'
}

export default function usePersistedTableSort({
  defaultSortOrder = 'ASC',
}: {
  defaultSortOrder?: string
}) {
  console.log(defaultSortOrder)
  const { setQuery, query } = useRuntime()

  const { sortOrder } = query
  const { sortedBy } = query

  const shouldReverse = defaultSortOrder === 'DSC'

  const sorting = useTableSort({
    order: shouldReverse ? reverse(sortOrder) : sortOrder,
    by: sortedBy,
  })

  const { sorted } = sorting

  useEffect(() => {
    if (sorted.order && sorted.by) {
      setQuery({
        sortOrder: shouldReverse ? reverse(sorted.order) : sorted.order,
        sortedBy: sorted.by,
      })
    }
  }, [sorted, setQuery])

  return {
    sortOrder,
    sortedBy,
    sorting: {
      sorted: {
        order: shouldReverse ? reverse(sorting.sorted.order) : sorting.sorted.order,
        by: sorting.sorted.by,
      },
      sort: sorting.sort,
      clear: sorting.clear,
      defaultOrder: defaultSortOrder,
    },
  }
}
