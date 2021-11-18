import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  //console.log('state now: ', state)
  //console.log('action', action)
  switch (action.type) {
    case 'VOTE':
      const id = action.data.id
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }

      return state.map(a => a.id !== id ? a : changedAnecdote)

    case 'NEW_ANECDOTE':
      return [...state, action.data]

    case 'INIT_ANECDOTES':
      return action.data

    default:
      return state
  }
}

export const voteAnecdote = (anecdote) => {
  const likedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  return async dispatch => {
    await anecdoteService.like(likedAnecdote) 
    dispatch({
      type: 'VOTE',
      data: { id: anecdote.id } 
    })
  }
}

export const newAnecdote = (content) => {
  return async dispatch => {
    const data = await anecdoteService.create(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const data = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data
    })
  }
}

export default reducer