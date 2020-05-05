import { useState } from 'react'

export default function useInverseTableSort(initialState?: any) {
  const [by, setBy] = useState(initialState.by)
  const [order, setOrder] = useState(initialState.order)

  const sort = (id: string) => {
    if (!by || by !== id) {
      // sortASC(id)
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
