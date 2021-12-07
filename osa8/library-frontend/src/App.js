import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { RECOMMEND, BOOK_ADDED, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const query = useQuery(RECOMMEND)

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }  
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`new book ${addedBook.title}`)
      updateCacheWith(addedBook)
    }
  })
  
  if (query.loading) {
    return null
  }
  
  const favoriteGenre = query.data.me.favoriteGenre

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        {page === 'authors'
          ? <Authors />
          : null
        }

        {page === 'books'
          ? <Books />
          : null
        }

        {page === 'login'
          ? <Login setToken={setToken}  setPage={setPage}/>
          : null
        }
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={() => logout()}>logout</button>
      </div>

      {page === 'authors'
        ? <Authors />
        : null
      }

      {page === 'books'
        ? <Books />
        : null
      }

      {page === 'add'
        ? <NewBook setPage={setPage}/>
        : null
      }

      {page === 'recommend'
        ? <Recommend
          favoriteGenre={favoriteGenre}
        />
        : null
      }
    </div>
  )
}

export default App