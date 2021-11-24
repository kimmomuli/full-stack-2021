const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name:1 })
  response.json(blogs)
})

blogRouter.delete('/:id', userExtractor ,async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)
  
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Not blog owner'})
  }
  
  await blog.remove()
  user.blogs = user.blogs.filter(b => b.id.toString() !== request.params.id.toString())
  await user.save()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
  response.json(updatedBlog.toJSON())
})

blogRouter.post('/', userExtractor ,async (request, response) => {
  const blog = new Blog(request.body)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!blog.url || !blog.title) {
    return response.status(400).send({ error: 'title or url missing ' })
  }

  if (!blog.likes) {
    blog.likes = 0
  }

  blog.user = user
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

module.exports = blogRouter