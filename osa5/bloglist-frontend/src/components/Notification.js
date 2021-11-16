import React from 'react'

const Error = ({ message }) => {
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