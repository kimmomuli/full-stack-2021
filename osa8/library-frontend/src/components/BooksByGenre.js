import { useLazyQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'
import React, { useEffect } from 'react'

const BooksWithGenre = ({ genre, allGenres, setGenre }) => {
  const [getBooks, result] = useLazyQuery(BOOKS_BY_GENRE, { variables: { genre } })

  useEffect(() => {
    getBooks()
  }, [getBooks])

  if (!result.called || result.loading) {
    return null
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      <p>in genre {genre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {allGenres.map(genre => {
          return <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
        })}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default BooksWithGenre