import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateForm from './components/Create'
import Toggleable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState('TESTI')
  const [password, setPassword] = useState('salasana')
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const createBlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUserName('')
      setPassword('')
    } catch (error) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const postBlog = async (newBlog) => {
    createBlogFormRef.current.toggleVisibility()
    try {
      const blog = await blogService.create(newBlog)

      setMessage(`a new blog ${blog.title} ${blog.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)

      setBlogs(blogs.concat(blog))
    } catch (error) {
      setMessage('failed post new blog')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const likeBlog = async (newBlog, id) => {
    const updatedBlog = await blogService.like(newBlog, id)
    const newBlogList = blogs.map(blog => blog.id === updatedBlog.id ? { ...blog, likes: updatedBlog.likes } : blog)
    setBlogs(newBlogList)
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      setBlogs([...blogs].filter(b => b.id !== blog.id))
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username:
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUserName(target.value)}
            />
          </div>
          <div>
            password:
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      <div>
        <p>{user.username} logged in<button onClick={logout} >logout</button></p>
      </div>
      <Toggleable buttonLabel="create new blog" ref={createBlogFormRef}>
        <CreateForm
          postBlog={postBlog}
        />
      </Toggleable>
      <div>
        {blogs
          .sort((first, second) => first.likes - second.likes)
          .reverse()
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              likeBlog={likeBlog}
              removeBlog={removeBlog}
            />
          )}
      </div>
    </div>
  )
}

export default App