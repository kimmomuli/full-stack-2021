import React, { useState } from 'react'

const CreateForm = ({ postBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    postBlog({
      title: title,
      author: author,
      url: url
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:
        <input
          id="title"
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <br/>
        author:
        <input
          id="author"
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br/>
        url:
        <input
          id="url"
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
        <br/>
        <button type="submit" id="create-blog">create</button>
      </form>
    </div>
  )
}

export default CreateForm