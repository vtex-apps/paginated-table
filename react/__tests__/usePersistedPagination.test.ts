import { act, renderHook } from '@vtex/test-tools/react'

import usePersistedPagination from '../usePersistedPagination'

const DEFAULT_TOTAL_ITEMS = 200

jest.mock('react-intl', () => ({
  defineMessages: (messages: any) => messages,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: any) => defaultMessage,
  }),
}))

const setupHook = (totalItems?: number) => {
  const hook = renderHook(props => usePersistedPagination(props), {
    initialProps: { resetPaginationOnChangeKey: '' }
  })

  act(() => {
    hook.result.current.setTotal(totalItems || DEFAULT_TOTAL_ITEMS)
  })

  return hook
}

const selectEvent = (rows: number) =>
  ({
    target: {
      value: rows.toString(),
    },
  } as any)

test('navigating to last doesnt surpass total', () => {
  const totalItems = 37
  const { result } = setupHook(totalItems)

  expect(result.current.from).toBe(0)
  expect(result.current.to).toBe(15)

  act(() => result.current.paginationProps.onNextClick())

  expect(result.current.from).toBe(15)
  expect(result.current.to).toBe(30)

  act(() => result.current.paginationProps.onNextClick())

  expect(result.current.from).toBe(30)
  expect(result.current.to).toBe(totalItems)
})

test('changing resetPaginationOnChangeKey redirects back to first page', () => {
  const { result, rerender } = setupHook()

  act(() => result.current.paginationProps.onRowsChange(selectEvent(25)))

  act(() => result.current.paginationProps.onNextClick())
  act(() => result.current.paginationProps.onNextClick())

  expect(result.current.from).toBe(50)
  expect(result.current.to).toBe(75)

  rerender({ resetPaginationOnChangeKey: '..' })

  expect(result.current.from).toBe(0)
  expect(result.current.to).toBe(25)
})

test('adjusting elements per page floors page to closest multiple', () => {
  const { result } = setupHook()

  act(() => result.current.paginationProps.onNextClick())

  expect(result.current.paginationProps.selectedOption).toBe(15)
  expect(result.current.from).toBe(15)
  expect(result.current.to).toBe(30)

  act(() => result.current.paginationProps.onRowsChange(selectEvent(10)))

  expect(result.current.paginationProps.selectedOption).toBe(10)
  expect(result.current.from).toBe(10)
  expect(result.current.to).toBe(20)

  act(() => result.current.paginationProps.onRowsChange(selectEvent(25)))

  expect(result.current.paginationProps.selectedOption).toBe(25)
  expect(result.current.from).toBe(0)
  expect(result.current.to).toBe(25)

  act(() => result.current.paginationProps.onNextClick())
  act(() => result.current.paginationProps.onRowsChange(selectEvent(10)))


  expect(result.current.paginationProps.selectedOption).toBe(10)
  expect(result.current.from).toBe(20)
  expect(result.current.to).toBe(30)
})
