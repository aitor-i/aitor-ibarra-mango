'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex flex-col py-32 items-center  h-screen  ">
      <h2>Something went wrong!</h2>
      <button
        onClick={
          () => reset()
        }
      >
        Try again
      </button>
    </section>
  )
}
