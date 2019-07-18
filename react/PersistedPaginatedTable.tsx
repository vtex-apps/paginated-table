import React, { useState, useEffect, useRef } from 'react'
import { Table } from 'vtex.styleguide'
import { JSONSchema6Type } from 'json-schema'
import { defineMessages, FormattedMessage } from 'react-intl'

import { useRuntime } from 'vtex.render-runtime'

const INITIAL_ELEMENTS_PER_PAGE = 15

type Props<TItem, TSchema extends JSONSchema6Type> = {
  total: number
  updatePaginationKey?: string
  onSortChange?: (sortedBy: string, sortOrder: string) => void
  defaultElementsPerPage?: number
  defaultSortOrder?: string
} & TableProps<TItem, TSchema>

type TableProps<TItem, TSchema extends JSONSchema6Type> = {
  items: TItem[]
  schema: TSchema
  loading?: boolean
  emptyStateLabel?: React.ReactNode
  emptyStateChildren?: React.ReactNode
  onRowClick?: OnRowClickHandler<TItem>
  totalizers?: any
  filters?: any
  toolbar?: {
    inputSearch?: {
      value: IntlMessage
      placeholder: React.ReactNode
      onChange: React.ChangeEventHandler<HTMLInputElement>
      onClear: React.ChangeEventHandler<HTMLInputElement>
      onSubmit: React.MouseEventHandler<HTMLSpanElement>
    }
    density?: {
      buttonLabel: IntlMessage
      lowOptionLabel: IntlMessage
      mediumOptionLabel: IntlMessage
      highOptionLabel: IntlMessage
    }
    fields?: {
      label: IntlMessage
      showAllLabel: IntlMessage
      hideAllLabel: IntlMessage
    }
    download?: {
      label: IntlMessage
      handleCallback: () => void
    }
    upload?: {
      label: IntlMessage
      handleCallback: () => void
    }
    extraActions?: {
      label: IntlMessage
      actions: {
        label: IntlMessage
        handleCallback: () => void
      }[]
    }
    newLine?: {
      label: IntlMessage
      handleCallback: () => void
    }
  }
  lineActions?: {
    label: () => IntlMessage
    isDangerous?: boolean
    onClick: Function
  }[]
  bulkActions?: {
    texts: {
      secondaryActionsLabel: string
      rowsSelected: Function
      selectAll: string
      allRowsSelected: Function
    }
    totalItems?: number
    main: {
      label: string
      handleCallback: Function
    }
    others: {
      label: string
      handleCallback: Function
    }[]
  }
}

export type OnRowClickHandler<TItem> = ({ rowData }: { rowData: TItem }) => void
export type IntlMessage = string | JSX.Element

const messages = defineMessages({
  of: {
    id: 'admin/channels.table.of',
    defaultMessage: 'of',
  },
  showRowsLabel: {
    id: 'admin/channels.table.show-rows',
    defaultMessage: 'Show rows',
  },
})

const PersistedPaginatedTable = <
  TItem,
  TSchema extends JSONSchema6Type
>(
  props: Props<TItem, TSchema>
) => {
  const [sortedBy, setSortedBy] = useState('')
  const didMountRef = useRef(false)

  const { setQuery, query } = useRuntime()

  const {
    items = [],
    total,
    updatePaginationKey,
    onSortChange = () => { },
    defaultSortOrder = 'ASC',
    defaultElementsPerPage = INITIAL_ELEMENTS_PER_PAGE,
    ...tableProps
  } = props

  useEffect(() => {
    if (didMountRef.current) {
      setQuery({ to: defaultElementsPerPage, from: 0, elements: defaultElementsPerPage })
    } else {
      didMountRef.current = true
    }
  }, [updatePaginationKey])

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

  const elementsPerPage = parseInt(query.elements) || defaultElementsPerPage
  const from = parseInt(query.from) || 0
  const to = parseInt(query.to) || elementsPerPage
  const sortOrder = query.sortOrder || defaultSortOrder

  return (
    <Table
      fullWidth
      items={items}
      pagination={{
        currentItemFrom: from + 1,
        currentItemTo: to,
        onNextClick: onPageChange(from, elementsPerPage, 'next'),
        onPrevClick: onPageChange(from, elementsPerPage, 'prev'),
        rowsOptions: [5, 10, 15, 25],
        selectedOption: elementsPerPage,
        onRowsChange: async (e: React.ChangeEvent<HTMLSelectElement>) => {
          const newElementsPerPage = parseInt(e.target.value)
          const currentPage = Math.floor(from / newElementsPerPage)
          const newFrom = currentPage * newElementsPerPage
          setQuery({ elements: newElementsPerPage, from: newFrom, to: newFrom + newElementsPerPage })
        },
        textOf: <FormattedMessage {...messages.of} />,
        textShowRows: <FormattedMessage {...messages.showRowsLabel} />,
        totalItems: total,
      }}
      density="low"
      sort={{
        sortedBy,
        sortOrder,
      }}
      onSort={({
        sortOrder: newSortOrder,
        sortedBy: newSortedBy,
      }: {
        sortOrder: string
        sortedBy: string
      }) => {
        setQuery({ sortOrder: newSortOrder })
        setSortedBy(newSortedBy)
        onSortChange(newSortedBy, newSortOrder)
      }}
      {...tableProps}
    />
  )
}

export default PersistedPaginatedTable
