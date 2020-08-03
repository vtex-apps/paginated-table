import React from 'react'
import { render, fireEvent, getNodeText } from '@vtex/test-tools/react'
import ExtendedTable from '../ExtendedTable'
import usePersistedTableSort from '../usePersistedTableSort'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(_query => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
})

const TableWithInverseSorting = ({ items }: { items: any[] }) => {
  const { sortOrder, sortedBy: sortBy, sorting } = usePersistedTableSort({
    defaultSortOrder: 'DSC',
  })

  const columns = [
    {
      id: 'name',
      title: 'Name',
      cellRenderer: ({ data }: { data: string }) => <div data-testid="name-cell">{data}</div>,
    },
    {
      id: 'price',
      title: 'Price',
      cellRenderer: ({ data }: { data: number }) => <div data-testid="price-cell">{data}</div>,
      sortable: true,
    },
  ]

  const sortedItems =
    sortBy == 'price' && sortOrder
      ? items.sort((itemA: any, itemB: any) => {
          return sortOrder === 'ASC' ? itemA.price - itemB.price : itemB.price - itemA.price
        })
      : items

  return (
    <ExtendedTable
      measures={{ tableHeight: items.length * 100 }}
      items={sortedItems}
      columns={columns}
      sorting={sorting}
      loading={false}
    />
  )
}

test('should sort in reverse order (dsc first)', () => {
  const mostExpensiveName = 'Most expensive'
  const leastExpensiveName = 'Least expensive'

  const mockItems = [
    {
      id: 1,
      name: 'Product',
      price: 5,
    },
    {
      id: 2,
      name: 'Product',
      price: 5,
    },
    {
      id: 3,
      name: 'Product',
      price: 5,
    },
    {
      id: 4,
      name: mostExpensiveName,
      price: 20,
    },
    {
      id: 5,
      name: leastExpensiveName,
      price: 1,
    },
    {
      id: 6,
      name: 'Product',
      price: 5,
    },
  ]

  const { getByText, getAllByTestId } = render(<TableWithInverseSorting items={mockItems} />)

  const priceHeader = getByText(/price/i)
  fireEvent.click(priceHeader)

  let firstNameCell = getAllByTestId('name-cell')[0]

  expect(getNodeText(firstNameCell)).toBe(mostExpensiveName)

  fireEvent.click(priceHeader)

  firstNameCell = getAllByTestId('name-cell')[0]

  expect(getNodeText(firstNameCell)).toBe(leastExpensiveName)
})
