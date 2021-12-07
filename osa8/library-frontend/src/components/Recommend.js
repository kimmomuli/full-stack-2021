import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'

const Recommend = ({ favoriteGenre }) => {
  const [getBooks, result] = useLazyQuery(BOOKS_BY_GENRE, { variables: { genre: favoriteGenre }, fetchPolicy: 'no-cache' })

  useEffect(() => {
    getBooks()
  }, [getBooks])

  if (!result.called || result.loading) {
    return null
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>recomendations</h2>
      <p>books in your favorite genre {favoriteGenre}</p>
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
    </div>
  )
}

export default Recommend