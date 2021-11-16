import React, { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [show, setShow] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const visible = () => {
    setShow(!show)
  }

  const like = (event) => {
    event.preventDefault()
    likeBlog({
      id: blog.id,
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }, blog.id)
  }

  if (show) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={visible}>hide</button>
        <br/>
        {blog.url}
        <br/>
        likes {blog.likes} <button onClick={like} id='like-button'>like</button>
        <br/>
        {blog.user.username}
        <br/>
        <button onClick={() => removeBlog(blog)} id="remove-button">remove</button>
      </div>
    )
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button onClick={visible} id="view-button">view</button>
    </div>
  )
}

export default Blog