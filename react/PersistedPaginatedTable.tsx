import { JSONSchema6Type } from 'json-schema'
import React, { useEffect, useRef } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import { useRuntime } from 'vtex.render-runtime'
import { Table } from 'vtex.styleguide'

const INITIAL_ELEMENTS_PER_PAGE = 15

type Props<TItem, TSchema extends JSONSchema6Type> = {
  total: number
  updatePaginationKey?: string
  defaultElementsPerPage?: number
  defaultSortOrder?: string
  defaultSortedBy?: string
} & TableProps<TItem, TSchema>

interface TableProps<TItem, TSchema extends JSONSchema6Type> {
  items: TItem[]
  schema: TSchema
  loading?: boolean
  fullWidth?: boolean
  density?: 'low' | 'medium' | 'high'
  emptyStateLabel?: React.ReactNode
  emptyStateChildren?: React.ReactNode
  dynamicRowHeight?: boolean
  onRowClick?: OnRowClickHandler<TItem>
  onRowHover?: () => void
  totalizers?: any
  filters?: any
  toolbar?: {
    inputSearch?: {
      value: IntlMessage
      placeholder: React.ReactNode
      onChange: React.ChangeEventHandler<HTMLInputElement>
      onClear: React.ChangeEventHandler<HTMLInputElement>
      onSubmit: React.FormEventHandler<HTMLFormElement>
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
        label: IntlMessage
        handleCallback: () => void
      }>
    }
    newLine?: {
      label: IntlMessage
      handleCallback: () => void
    }
  }
  lineActions?: Array<{
    label: () => IntlMessage
    isDangerous?: boolean
    onClick: () => void
  }>
  bulkActions?: {
    texts: {
      secondaryActionsLabel: string
      rowsSelected: (qty: number) => void
      selectAll: string
      allRowsSelected: () => void
    }
    totalItems?: number
    main: {
      label: string
      handleCallback: (params: { selectedRows: TItem[] }) => void
    }
    others: Array<{
      label: string
      handleCallback: (params: { selectedRows: TItem[] }) => void
    }>
  }
  pagination: {
    hasPageTopIndicator: boolean
  }
}

export type OnRowClickHandler<TItem> = ({ rowData }: { rowData: TItem }) => void
export type IntlMessage = string | JSX.Element

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
    pagination: { hasPageTopIndicator } = { hasPageTopIndicator: false },
    ...tableProps
  } = props

  const elementsPerPage = parseInt(query.elements, 10) || defaultElementsPerPage

  useEffect(() => {
    if (didMountRef.current) {
      setQuery({ to: elementsPerPage, from: 0, elements: elementsPerPage })
    } else {
      didMountRef.current = true
    }
  }, [updatePaginationKey])

  useEffect(() => {
    if (total && total < query.to) {
      setQuery({ to: elementsPerPage, from: 0, elements: elementsPerPage })
    }
  }, [total])

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

  const from = parseInt(query.from, 10) || 0
  const to = parseInt(query.to, 10) || elementsPerPage
  const sortOrder = query.sortOrder || defaultSortOrder
  const sortedBy = query.sortedBy || defaultSortedBy

  return (
    <Table
      fullWidth
      items={items}
      pagination={{
        currentItemFrom: from + 1,
        currentItemTo: to,
        hasPageTopIndicator,
        itemLabel: <FormattedMessage values={{ total }} {...messages.itemLabel} />,
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
        textOf: <FormattedMessage {...messages.of} />,
        textShowRows: <FormattedMessage {...messages.showRowsLabel} />,
        totalItems: total,
      }}
      density="low"
      sort={{
        preferentialSortOrder: defaultSortOrder,
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
    />
  )
}

export default PersistedPaginatedTable
