import { useState } from 'react'

export default function useInverseTableSort(initialState?: { by: string; order: string }) {
  const [by, setBy] = useState<string | undefined>(initialState?.by)
  const [order, setOrder] = useState<string | undefined>(initialState?.order)

  const sort = (id: string) => {
    if (!by || by !== id) {
      setOrder('DSC')
      setBy(id)
    } else {
      setOrder((currentOrder: string | undefined) => {
        return currentOrder === 'DSC' ? 'ASC' : 'DSC'
      })
      setBy(id)
    }
  }

  const clear = () => {
    setBy(undefined)
    setOrder(undefined)
  }

  return {
    sorted: {
      order: order,
      by: by,
    },
    sort: sort,
    clear: clear,
    defaultOrder: 'DSC',
  }
}
