import { act, renderHook } from '@vtex/test-tools/react'

import useExpandableRows from '../useExpandableRows'

const mockItems = [
  {
    id: "1",
  },
  {
    id: "2",
  },
  {
    id: "3",
  },
  {
    id: "4",
  },
  {
    id: "5",
  },
  {
    id: "6",
  },
  {
    id: "7",
  },
  {
    id: "8",
  }
]

test('starts with no rows expanded', () => {

  const { result } = renderHook(() => useExpandableRows({ items: mockItems }))

  expect(result.current.expandedRowsAmount).toBe(0)
  expect(result.current.isRowExpandedMap["1"]).toBeFalsy()
})

test('toggling rows updates expanded rows map and amount', () => {

  const { result } = renderHook(() => useExpandableRows({ items: mockItems }))

  act(() => result.current.toggleExpandRow("1"))
  act(() => result.current.toggleExpandRow("4"))
  act(() => result.current.toggleExpandRow("5"))

  expect(result.current.expandedRowsAmount).toBe(3)
  expect(result.current.isRowExpandedMap["1"]).toBeTruthy()
  expect(result.current.isRowExpandedMap["4"]).toBeTruthy()
  expect(result.current.isRowExpandedMap["5"]).toBeTruthy()

  act(() => result.current.toggleExpandRow("4"))
  act(() => result.current.toggleExpandRow("5"))

  expect(result.current.expandedRowsAmount).toBe(1)
  expect(result.current.isRowExpandedMap["4"]).toBeFalsy()
  expect(result.current.isRowExpandedMap["5"]).toBeFalsy()

})

test('expanding all updates all rows to expanded', () => {

  const { result } = renderHook(() => useExpandableRows({ items: mockItems }))

  act(() => result.current.expandAll())

  expect(result.current.expandedRowsAmount).toBe(mockItems.length)
  expect(result.current.isRowExpandedMap["1"]).toBeTruthy()
  expect(result.current.isRowExpandedMap["4"]).toBeTruthy()
  expect(result.current.isRowExpandedMap["5"]).toBeTruthy()

  act(() => result.current.toggleExpandRow("5"))

  expect(result.current.expandedRowsAmount).not.toBe(mockItems.length)

  act(() => result.current.expandAll())
  expect(result.current.expandedRowsAmount).toBe(mockItems.length)
  expect(result.current.isRowExpandedMap["5"]).toBeTruthy()

})

test('collapse all updates all rows to collapsed', () => {

  const { result } = renderHook(() => useExpandableRows({ items: mockItems }))

  act(() => result.current.expandAll())
  act(() => result.current.collapseAll())

  expect(result.current.expandedRowsAmount).toBe(0)
  expect(result.current.isRowExpandedMap["1"]).toBeFalsy()
  expect(result.current.isRowExpandedMap["4"]).toBeFalsy()
  expect(result.current.isRowExpandedMap["5"]).toBeFalsy()

  act(() => result.current.toggleExpandRow("5"))
  act(() => result.current.collapseAll())

  expect(result.current.expandedRowsAmount).toBe(0)
  expect(result.current.isRowExpandedMap["5"]).toBeFalsy()

})

