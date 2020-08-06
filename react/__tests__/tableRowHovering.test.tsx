import React, { useState } from 'react'
import { render, fireEvent, getNodeText } from '@vtex/test-tools/react'
import ExtendedTable from '../ExtendedTable'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(_query => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
})

const TableWithRowHovering = ({ items }: { items: any[] }) => {
  const [hoveredId, setHoveredId] = useState(null)

  const columns = [
    {
      id: 'name',
      title: 'Name',
      cellRenderer: ({ data }: { data: string }) => <div data-testid="name-cell">{data}</div>,
    },
    {
      id: 'hoverIndicator',
      title: '',
      cellRenderer: ({ data }: { data: { id: string } }) => (
        <div data-testid="hover-indicator-cell">
          {data.id === hoveredId ? 'This row is hovered' : 'This row is NOT hovered'}
        </div>
      ),
      extended: true,
    },
  ]

  const hovering = {
    onMouseEnter: (id: string) => {
      setHoveredId(id)
    },
    onMouseLeave: () => {
      setHoveredId(null)
    },
  }

  return (
    <ExtendedTable
      measures={{ tableHeight: items.length * 100 }}
      items={items}
      columns={columns}
      loading={false}
      hovering={hovering}
    />
  )
}

test('should indicate hovered rows with text', () => {
  const mockItems = [
    {
      id: 1,
      name: 'Product',
    },
    {
      id: 2,
      name: 'Product',
    },
    {
      id: 3,
      name: 'Product',
    },
    {
      id: 4,
      name: 'Product',
    },
    {
      id: 5,
      name: 'Product',
    },
    {
      id: 6,
      name: 'Product',
    },
  ]

  const { getAllByTestId } = render(<TableWithRowHovering items={mockItems} />)

  const firstNameCell = getAllByTestId('name-cell')[0]
  const secondtNameCell = getAllByTestId('name-cell')[1]
  const firstHoverCell = getAllByTestId('hover-indicator-cell')[0]
  const secondHoverCell = getAllByTestId('hover-indicator-cell')[1]
  fireEvent.mouseOver(firstNameCell)

  expect(getNodeText(firstHoverCell)).toBe('This row is hovered')
  expect(getNodeText(secondHoverCell)).toBe('This row is NOT hovered')

  fireEvent.mouseOver(secondtNameCell)

  expect(getNodeText(secondHoverCell)).toBe('This row is hovered')
  expect(getNodeText(firstHoverCell)).toBe('This row is NOT hovered')
})
