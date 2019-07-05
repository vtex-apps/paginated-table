import React, { useState, useEffect } from 'react'
import { Table } from 'vtex.styleguide'
import { GraphqlQueryControls } from 'react-apollo'
import { JSONSchema6Type } from 'json-schema'
import { defineMessages, FormattedMessage } from 'react-intl'

const INITIAL_ELEMENTS_PER_PAGE = 15

type Props<TItem, TQueryVariables, TSchema extends JSONSchema6Type> = {
  fetchMore: GraphqlQueryControls<TQueryVariables>['fetchMore']
  total: number
  updateQuery: any
  updatePaginationKey?: string
  onSortChange?: (sortedBy: string, sortOrder: string) => void
} & TableProps<TItem, TSchema>

type TableProps<TItem, TSchema extends JSONSchema6Type> = {
  items: TItem[]
  schema: TSchema
  loading?: boolean
  emptyStateLabel?: React.ReactNode
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

const PaginatedTable = <
  TItem,
  TQueryVariables extends { to: number; from: number },
  TSchema extends JSONSchema6Type
>(
  props: Props<TItem, TQueryVariables, TSchema>
) => {
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(INITIAL_ELEMENTS_PER_PAGE)
  const [currentPage, setCurrentPage] = useState(0)
  const [elementsPerPage, setElementsPerPage] = useState(
    INITIAL_ELEMENTS_PER_PAGE
  )
  const [sortedBy, setSortedBy] = useState('eventDate')
  const [sortOrder, setSortOrder] = useState('ASC')

  const {
    items = [],
    updateQuery,
    total,
    fetchMore,
    updatePaginationKey,
    onSortChange = () => {},
    ...tableProps
  } = props

  useEffect(() => {
    setFrom(0)
    setTo(elementsPerPage)
    setCurrentPage(0)
  }, [updatePaginationKey])

  const onPageChange = (
    newPage: number,
    currentElementsPerPage: number = elementsPerPage
  ) => async () => {
    const from = newPage * currentElementsPerPage

    const to = Math.min((newPage + 1) * currentElementsPerPage, total)

    if (items.slice(from, to).length !== to - from) {
      await fetchMore({
        updateQuery,
        variables: { from, to },
      })
    }

    setTo(to)
    setFrom(from)
    setCurrentPage(newPage)
  }

  const totalPages = Math.ceil(total / elementsPerPage)

  const nextPage = (currentPage + 1) % totalPages

  const previousPage =
    totalPages - 1 - ((totalPages - currentPage) % totalPages)

  return (
    <Table
      fullWidth
      items={items.slice(from, to)}
      pagination={{
        currentItemFrom: from + 1,
        currentItemTo: to,
        onNextClick: onPageChange(nextPage),
        onPrevClick: onPageChange(previousPage),
        rowsOptions: [5, 10, 15, 25],
        selectedOption: elementsPerPage,
        onRowsChange: async (e: React.ChangeEvent<HTMLSelectElement>) => {
          setElementsPerPage(parseInt(e.target.value))
          onPageChange(currentPage, parseInt(e.target.value))()
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
        setSortOrder(newSortOrder)
        setSortedBy(newSortedBy)
        onSortChange(newSortedBy, newSortOrder)
      }}
      {...tableProps}
    />
  )
}

export default PaginatedTable
