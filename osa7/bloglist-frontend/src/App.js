import { Switch, Route, Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import CreateForm from './components/Create'
import Toggleable from './components/Togglable'
import Login from './components/Login'
import Users from './components/Users'
import User from './components/User'
import OneBlog from './components/OneBlog'

import { useDispatch, useSelector } from 'react-redux'
import { createNotification } from './reducers/notificationReducer'
import { getAllBlogs, addBlog } from './reducers/blogReducer'
import { login, logOut } from './reducers/userReducer'


const App = () => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [username, setUserName] = useState('TESTI')
  const [password, setPassword] = useState('salasana')

  const dispatch = useDispatch()
  const createBlogFormRef = useRef()

  const blogs = useSelector(state => state.blog)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getAllBlogs())
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      dispatch(login(username, password))
      setUserName('')
      setPassword('')
    } catch (error) {
      dispatch(createNotification('wrong username or password'))
    }
  }

  const logout = () => {
    dispatch(logOut())
    window.localStorage.clear()
  }

  const postBlog = async (newBlog) => {
    createBlogFormRef.current.toggleVisibility()
    try {
      dispatch(addBlog(newBlog))
      dispatch(createNotification(`a new blog ${newBlog.title} ${newBlog.author}`))
    } catch (error) {
      console.error(error)
    }
  }

  if (user === null) {
    return (
      <div>
        <Login
          handleLogin={handleLogin}
          username={username}
          setUserName={setUserName}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }

  const padding = {
    padding: 5
  }

  return (
    <div className='container'>
      <div>
        <Link style={padding} to='/'>blogs</Link>
        <Link style={padding} to='/users'>users</Link>
        {user.username} logged in <button onClick={logout} >logout</button>
      </div>
      <Notification />
      <h2>blog app</h2>
      <Switch>
        <Route path='/users/:id'>
          <User logout={logout} user={user} />
        </Route>
        <Route path='/blogs/:id'>
          <OneBlog logout={logout} user={user} />
        </Route>
        <Route path='/users'>
          <Users />
        </Route>
        <Route path='/'>
          <div>
            <Toggleable buttonLabel="create new blog" ref={createBlogFormRef}>
              <CreateForm
                postBlog={postBlog}
              />
            </Toggleable>
            <div>
              {blogs
                .sort((first, second) => second.likes - first.likes)
                .map(blog => <div key={blog.id} style={blogStyle} ><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></div>
                )}
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  )
}

export default App