import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getAllBlogs, giveLikeToBlog } from '../reducers/blogReducer'

const OneBlog = () => {
  const id = useParams().id
  const dispatch = useDispatch()

  useEffect(async () => {
    dispatch(getAllBlogs())
  }, [dispatch])

  const likeBlog = async (blog) => {
    dispatch(giveLikeToBlog({
      id: blog.id,
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }, blog.id))
  }

  const allBlogs = useSelector(state => state.blog)
  const blog = allBlogs.find(b => b.id === id)

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <br/>
        {blog.likes} likes <button onClick={() => likeBlog(blog)}>like</button>
        <br/>
        added by {blog.user.username}
      </div>
    </div>
  )
}

export default OneBlog