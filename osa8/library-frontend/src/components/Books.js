import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import BooksByGenre from './BooksByGenre'

const Books = () => {
  const query = useQuery(ALL_BOOKS)

  const [genre, setGenre] = useState('')
  
  if (query.loading) {
    return null 
  } 

  const books = query.data.allBooks
  let allGenres = []

  books.map(book => 
    book.genres.map(genre => {
      if (!allGenres.includes(genre)) {
        return allGenres = allGenres.concat(genre)
      }
      return null
    })
  )

  if (genre !== '') {
    return (
      <BooksByGenre
        genre={genre}
        allGenres={allGenres}
        setGenre={setGenre}
      />
    )
  }

  return (
    <div>
      <h2>books</h2>
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
        {allGenres.map(genre => 
          <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
        )}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books