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
  const { setQuery, query } = useRuntime()

  const { sortOrder } = query
  const { sortedBy } = query

  const sort = (id: string) => {
    if (!sortedBy || sortedBy !== id) {
      setQuery({
        sortOrder: defaultSortOrder,
        sortedBy: id,
      })
    } else {
      setQuery({
        sortOrder: reverse(sortOrder),
        sortedBy: id,
      })
    }
  }

  const clear = () => {
    setQuery({
      sortOrder: undefined,
      sortedBy: undefined,
    })
  }

  return {
    sortOrder,
    sortedBy,
    sorting: {
      sorted: {
        order: sortOrder,
        by: sortedBy,
      },
      sort,
      clear: clear,
      defaultOrder: defaultSortOrder,
    },
  }
}
