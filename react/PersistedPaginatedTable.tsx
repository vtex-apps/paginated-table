import { JSONSchema6Type } from 'json-schema'
import React, { useEffect, useRef } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Table } from 'vtex.styleguide'

import { useRuntime } from 'vtex.render-runtime'

const INITIAL_ELEMENTS_PER_PAGE = 15

type Props<TItem, TSchema extends JSONSchema6Type> = {
  total: number
  updatePaginationKey?: string
  defaultElementsPerPage?: number
  defaultSortOrder?: string
  defaultSortedBy?: string
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
  selectedRows?: any[]
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
      actions: Array<{
        handleCallback: () => void
        label: IntlMessage
      }>
    }
    newLine?: {
      label: IntlMessage
      handleCallback: () => void
    }
  }
  lineActions?: Array<{
    isDangerous?: boolean
    label: () => IntlMessage
    onClick: Function
  }>
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
    others: Array<{
      handleCallback: Function
      label: string
    }>
  }
}

export type OnRowClickHandler<TItem> = ({ rowData }: { rowData: TItem }) => void
export type IntlMessage = string | JSX.Element

const messages = defineMessages({
  of: {
    defaultMessage: 'of',
    id: 'admin/table.of',
  },
  showRowsLabel: {
    defaultMessage: 'Show rows',
    id: 'admin/table.show-rows',
  },
})

const PersistedPaginatedTable = <TItem, TSchema extends JSONSchema6Type>(
  props: Props<TItem, TSchema>
) => {
  const didMountRef = useRef(false)

  const { setQuery, query } = useRuntime()

  const {
    items = [],
    total,
    updatePaginationKey,
    defaultSortOrder = 'ASC',
    defaultElementsPerPage = INITIAL_ELEMENTS_PER_PAGE,
    defaultSortedBy = '',
    selectedRows,
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
  const sortedBy = query.sortedBy || defaultSortedBy

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
          setQuery({
            elements: newElementsPerPage,
            from: newFrom,
            to: newFrom + newElementsPerPage,
          })
        },
        textOf: <FormattedMessage {...messages.of} />,
        textShowRows: <FormattedMessage {...messages.showRowsLabel} />,
        totalItems: total,
      }}
      density="low"
      sort={{
        sortOrder,
        sortedBy,
      }}
      onSort={({
        sortOrder: newSortOrder,
        sortedBy: newSortedBy,
      }: {
        sortOrder: string
        sortedBy: string
      }) => {
        setQuery({ sortOrder: newSortOrder, sortedBy: newSortedBy })
      }}
      {...tableProps}
      bulkActions={{
        ...props.bulkActions,
        selectedRows,
      }}
    />
  )
}

export default PersistedPaginatedTable
