import { act, renderHook } from '@vtex/test-tools/react'

import usePersistedTableSort from '../usePersistedTableSort'

const columnId = 'column_id'
const differentColumnId = 'column_id2'

test('performing sort updates sort values correctly', () => {

  const { result } = renderHook(() => usePersistedTableSort({}))

  act(() => result.current.sorting.sort(columnId))

  expect(result.current.sortOrder).toBe('ASC')
  expect(result.current.sortedBy).toBe(columnId)

  act(() => result.current.sorting.sort(columnId))

  expect(result.current.sortOrder).toBe('DSC')
  expect(result.current.sortedBy).toBe(columnId)

  act(() => result.current.sorting.sort(differentColumnId))

  expect(result.current.sortOrder).toBe('ASC')
  expect(result.current.sortedBy).toBe(differentColumnId)
})

test('performing clear clears sort', () => {

  const { result } = renderHook(() => usePersistedTableSort({}))

  act(() => result.current.sorting.sort(columnId))
  act(() => result.current.sorting.clear())

  expect(result.current.sortOrder).toBe(undefined)
  expect(result.current.sortedBy).toBe(undefined)
})

test('performing sort with dsc default order starts ordering by dsc', () => {

  const { result } = renderHook(() => usePersistedTableSort({ defaultSortOrder: 'DSC' }))

  act(() => result.current.sorting.sort(columnId))

  expect(result.current.sortOrder).toBe('DSC')
  expect(result.current.sortedBy).toBe(columnId)

  act(() => result.current.sorting.sort(columnId))

  expect(result.current.sortOrder).toBe('ASC')
  expect(result.current.sortedBy).toBe(columnId)

  act(() => result.current.sorting.sort(differentColumnId))

  expect(result.current.sortOrder).toBe('DSC')
  expect(result.current.sortedBy).toBe(differentColumnId)
})

