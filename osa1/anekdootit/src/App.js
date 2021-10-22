import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const [points, setPoints] = useState(new Uint8Array(7))
  const [mostVotesIndex, setMostVotesIndex] = useState(0)
  const [selected, setSelected] = useState(0)

  const handleClick = () => {
    const randomNumber = Math.floor(Math.random() * 7)
    setSelected(randomNumber)
  }

  const vote = () => {
    const copyList = [...points]
    copyList[selected] += 1
    setPoints(copyList)
    setMostVotesIndex(copyList.indexOf(Math.max(...copyList)))
  }
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br/>
      has {points[selected]} votes
      <br/>
      <button onClick={vote}>vote</button>      
      <button onClick={handleClick}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVotesIndex]}
    </div>
  )
}

export default App