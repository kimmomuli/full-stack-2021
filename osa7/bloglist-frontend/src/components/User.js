import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAll } from '../reducers/allUsersReducer'

const User = () => {
  const id = useParams().id
  const dispatch = useDispatch()

  useEffect(async () => {
    dispatch(getAll())
  }, [dispatch])

  const allUsers = useSelector(state => state.allUsers)

  const foundUser = allUsers.find(u => u.id === id)

  if (!foundUser) {
    return null
  }

  return (
    <div>
      <h2>{foundUser.username}</h2>
      <h4>added blogs</h4>
      <ul>
        {foundUser.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

export default User