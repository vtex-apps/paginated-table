import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
import ExtendedTable from '../ExtendedTable'
import useExpandableRows from '../useExpandableRows'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(_query => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
})

const TableWithRowExpansion = ({ items }: { items: any[] }) => {
  const columns = [
    {
      id: 'name',
      title: 'Name',
      cellRenderer: ({ data }: { data: string }) => <div data-testid="name-cell">{data}</div>,
    },
  ]

  const rowExpansion = useExpandableRows({
    items,
  })

  return (
    <ExtendedTable
      measures={{ tableHeight: items.length * 100 }}
      items={items}
      columns={columns}
      loading={false}
      onRowClick={({
        rowData: { id },
      }: {
        rowData: {
          id: any
        }
      }) => {
        rowExpansion.toggleExpandRow(id)
      }}
      rowExpansion={rowExpansion}
    />
  )
}

test('should toggle collapsed info on row click', () => {
  const mockItems = [
    {
      id: 1,
      name: 'Product',
      isExpandable: true,
      extendedRowRenderer: <div>Extra hidden data for product 1</div>,
    },
    {
      id: 2,
      name: 'Product',
      isExpandable: true,
      extendedRowRenderer: <div>Extra hidden data for product 2</div>,
    },
    {
      id: 3,
      name: 'Product',
      isExpandable: true,
      extendedRowRenderer: <div>Extra hidden data for product 3</div>,
    },
    {
      id: 4,
      name: 'Product',
      isExpandable: true,
      extendedRowRenderer: <div>Extra hidden data for product 4</div>,
    },
    {
      id: 5,
      name: 'Product',
      isExpandable: true,
      extendedRowRenderer: <div>Extra hidden data for product 5</div>,
    },
    {
      id: 6,
      name: 'Product',
      isExpandable: true,
      extendedRowRenderer: <div>Extra hidden data for product 6</div>,
    },
  ]

  const { getAllByTestId, getByText, findByText } = render(
    <TableWithRowExpansion items={mockItems} />
  )

  const firstNameCell = getAllByTestId('name-cell')[0]
  const secondNameCell = getAllByTestId('name-cell')[1]

  fireEvent.click(firstNameCell)

  expect(getByText('Extra hidden data for product 1')).toBeDefined
  expect(findByText('Extra hidden data for product 2')).not.toBeDefined

  fireEvent.click(secondNameCell)

  expect(getByText('Extra hidden data for product 1')).toBeDefined
  expect(getByText('Extra hidden data for product 2')).toBeDefined

  fireEvent.click(firstNameCell)

  expect(findByText('Extra hidden data for product 1')).not.toBeDefined
  expect(getByText('Extra hidden data for product 2')).toBeDefined
})
