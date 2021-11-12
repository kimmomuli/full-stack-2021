const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name:1 })
  response.json(blogs)
})

blogRouter.post('/', userExtractor ,async (request, response) => {
  const body = request.body
  const user = request.user

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  
  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  //await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', userExtractor ,async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Not blog owner'})
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const newBlog = {
    title: body.title,
    author: body.author,
    likes: body.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  response.json(newBlog)
})

module.exports = blogRouter