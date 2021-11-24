import React from 'react'
import { useSelector } from 'react-redux'

const Error = () => {
  const message = useSelector(state => state.notification)
  if (message === null) {
    return null
  }

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export default Error