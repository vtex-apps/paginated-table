import { useRuntime } from 'vtex.render-runtime'
import { useState, useCallback, useEffect, useRef } from 'react'
import { useIntl, defineMessages } from 'react-intl'

const INITIAL_ELEMENTS_PER_PAGE = 15

const messages = defineMessages({
  itemLabel: {
    defaultMessage: '{total, plural, one {item} other {items}}',
    id: 'admin/table.item-label',
  },
  of: {
    defaultMessage: 'of',
    id: 'admin/table.of',
  },
  showRowsLabel: {
    defaultMessage: 'Show rows',
    id: 'admin/table.show-rows',
  },
})

export default function usePersistedPagination(props: {
  hasPageTopIndicator?: boolean
  defaultElementsPerPage?: number
  resetPaginationOnChangeKey: string
}) {
  const {
    defaultElementsPerPage = INITIAL_ELEMENTS_PER_PAGE,
    hasPageTopIndicator = false,
    resetPaginationOnChangeKey,
  } = props

  const { formatMessage } = useIntl()
  const [total, setTotal] = useState(defaultElementsPerPage)
  const { setQuery, query } = useRuntime()
  const didMountRef = useRef(false)

  const elementsPerPage = parseInt(query.elements, 10) || defaultElementsPerPage

  const onPageChange = (
    currentFrom: number,
    currentElementsPerPage: number,
    direction: string
  ) => async () => {
    const c = direction === 'next' ? 1 : -1

    const newFrom = currentFrom + c * currentElementsPerPage

    const newTo = Math.min(newFrom + currentElementsPerPage, total)

    setQuery({ to: newTo, from: newFrom, elements: currentElementsPerPage })
  }

  const resetPagination = useCallback(() => {
    setQuery({ to: elementsPerPage, from: 0, elements: elementsPerPage })
  }, [elementsPerPage, setQuery])

  const from = parseInt(query.from, 10) || 0
  const to = parseInt(query.to, 10) || elementsPerPage

  useEffect(() => {
    if (didMountRef.current) {
      resetPagination()
    } else {
      didMountRef.current = true
    }
  }, [resetPaginationOnChangeKey, resetPagination])

  return {
    resetPagination,
    from,
    to,
    setTotal,
    paginationProps: {
      currentItemFrom: from + 1,
      currentItemTo: to,
      hasPageTopIndicator,
      onNextClick: onPageChange(from, elementsPerPage, 'next'),
      onPrevClick: onPageChange(from, elementsPerPage, 'prev'),
      onRowsChange: async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newElementsPerPage = parseInt(e.target.value, 10)
        const currentPage = Math.floor(from / newElementsPerPage)
        const newFrom = currentPage * newElementsPerPage
        setQuery({
          elements: newElementsPerPage,
          from: newFrom,
          to: newFrom + newElementsPerPage,
        })
      },
      rowsOptions: [10, 15, 25],
      selectedOption: elementsPerPage,
      textOf: formatMessage(messages.of),
      textShowRows: formatMessage(messages.showRowsLabel),
      totalItems: total,
    },
  }
}
