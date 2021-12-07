import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = () => {
  const query = useQuery(ALL_AUTHORS)
  
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ {query: ALL_AUTHORS} ]
  })

  if (query.loading) {
    return null
  }

  const authors = query.data.allAuthors

  const setBirhyear = (event) => {
    event.preventDefault()
    changeAuthor({ variables: { name, setBornTo: Number(born) } })
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={setBirhyear}>
        <div>
          name
          <select onChange={(event) => setName(event.target.value)}>
          {authors.map(a => 
            <option key={a.name} value={a.name}>{a.name}</option>
          )}
          </select>
        </div>

        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors