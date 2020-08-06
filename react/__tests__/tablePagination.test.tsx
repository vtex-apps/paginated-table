import React, { useEffect } from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
import ExtendedTable from '../ExtendedTable'
import usePersistedPagination from '../usePersistedPagination'
import { EXPERIMENTAL_Table as Table } from 'vtex.styleguide'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(_query => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
})

const buildMockItems = (lenght: number) =>
  Array.from(Array(lenght), (_, i) => ({
    id: `${i + 1}`,
    name: `Product ${i + 1}`,
  }))

const TableWithPagination = ({ items, colorFilter }: { items: any[]; colorFilter?: string }) => {
  const columns = [
    {
      id: 'name',
      title: 'Name',
      cellRenderer: ({ data }: { data: string }) => <div data-testid="name-cell">{data}</div>,
    },
  ]

  const totalItems = items.length

  const { to, from, setTotal, paginationProps } = usePersistedPagination({
    defaultElementsPerPage: 15,
    resetPaginationOnChangeKey: `${colorFilter}`,
  })

  useEffect(() => {
    setTotal(totalItems)
  })

  const paginatedItems = items.slice(from, to)

  return (
    <>
      <ExtendedTable
        measures={{ tableHeight: items.length * 100 }}
        items={paginatedItems}
        columns={columns}
        loading={false}>
        <Table.Pagination {...paginationProps} />
      </ExtendedTable>
      <div onClick={() => paginationProps.onNextClick()}>Next Page button</div>
    </>
  )
}

test('pagination resets on filter change', () => {
  const itemsMock = buildMockItems(37)

  const { getByText, rerender } = render(<TableWithPagination items={itemsMock} />)

  expect(getByText('Product 1')).toBeDefined()
  expect(getByText('Product 15')).toBeDefined()

  fireEvent.click(getByText(/next page button/i))

  expect(getByText('Product 16')).toBeDefined()

  rerender(<TableWithPagination items={itemsMock} colorFilter={'pink'} />)

  expect(getByText('Product 1')).toBeDefined()
  expect(getByText('Product 15')).toBeDefined()
})
