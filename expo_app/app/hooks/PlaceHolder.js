import { useState } from 'react'

/**
 * Simple placeholder hook that mirrors set/get semantics for future shared hooks.
 */
export const usePlaceholder = (initialValue = null) => {
  const [value, setValue] = useState(initialValue)
  return { value, setValue }
}
