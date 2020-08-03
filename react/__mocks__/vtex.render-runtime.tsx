import { useState } from 'react'

export const useRuntime = jest.fn(() => {
  const [query, setQuery] = useState({})

  return {
    query: query,
    setQuery: jest.fn(setQuery),
  }
})
