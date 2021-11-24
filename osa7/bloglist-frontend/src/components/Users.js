import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAll } from '../reducers/allUsersReducer'
import { Link } from 'react-router-dom'

const Users = () => {
  const dispatch = useDispatch()

  useEffect(async () => {
    dispatch(getAll())
  }, [dispatch])

  const users = useSelector(state => state.allUsers)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.length !== 0
            ? users.map(u =>
              <tr key={u.id}>
                <td>
                  <Link key={u.id} to={`users/${u.id}`}>{u.name}</Link>
                </td>
                <td>{u.blogs.length}</td>
              </tr>
            )
            : null
          }
        </thead>
      </table>
    </div>
  )
}

export default Users