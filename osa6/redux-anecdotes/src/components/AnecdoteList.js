import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(s => {
    return s.anecdotes.filter(anecdote => {
      return anecdote.content.toLowerCase().includes(s.filter.toLowerCase())
    })
  })
  
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(createNotification(`you voted ${anecdote.content}`, 10))
  }

  return (
    <div>
      {anecdotes
        .sort((first, second) => second.votes - first.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default AnecdoteList