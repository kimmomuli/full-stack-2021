const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helpper = require('./test_helpper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)
const blogs = helpper.blogs
let token
beforeEach(async () => {
  await Blog.deleteMany({})
  const blog1 = new Blog(blogs[0])
  await blog1.save()
  const blog2 = new Blog(blogs[1])
  await blog2.save()
  const blog3 = new Blog(blogs[2])
  await blog3.save()

  await User.deleteMany({})
  const salt = 10
  const passwordHash = await bcrypt.hash('password', salt)
  const user = new User({ username: 'username', passwordHash })

  await user.save()

  const response = await api
    .post('/api/login')
    .send({ username: 'username', password: 'password' })

  token = response.body.token
})

describe('GET method', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length)
  })

  test('of identify is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})


describe('POST method', () => {
  test('a valid blog can be added', async () => {
    const blog = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length + 1)

    expect(response.body[blogs.length].author).toBe(blog.author)
    expect(response.body[blogs.length].likes).toBe(blog.likes)
    expect(response.body[blogs.length].title).toBe(blog.title)
    expect(response.body[blogs.length].url).toBe(blog.url)
  })

  test('likes have default value zero', async () => {
    const blog = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      __v: 0
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    console.log(response.body[blogs.length].likes)
    expect(response.body[blogs.length].likes).toBe(0)
  })

  test('if the blog has not titled, that one can not add', async () => {
    const blog = {
      id: '5a422a851b54a676234d17f7',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length)
  })

  test('if the blog has not ulr, that one can not add', async () => {
    const blog = {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length)
  })
})

describe('DELETE method', () => {
  test('if id does not exist will not delete anything', async () => {
    await api
      .delete(`/api/blogs/${helpper.nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)

    const response = await api.get('/api/blogs')
    expect(blogs.length).toBe(response.body.length)
  })

  test('if ID is valid, method will delete blog', async () => {

    const blog = {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length + 1)

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)

    const response2 = await api.get('/api/blogs')
    expect(response2.body).toHaveLength(blogs.length + 1)
  })
})

describe('PUT method', () => {
  test('of modify blog with valid ID', async () => {
    const firstBlogId = blogs[0]._id

    const changeValues = {
      title: 'titdfgsdfsdfsdle',
      author: 'autgdfghor',
      likes: 12332
    }

    await api
      .put(`/api/blogs/${firstBlogId}`)
      .send(changeValues)

    const response = await api.get('/api/blogs')
    console.log('response.body.title --->', response.body[0].title)
    expect(response.body[0].title).toBe('titdfgsdfsdfsdle')
    expect(response.body[0].author).toBe('autgdfghor')
    expect(response.body[0].likes).toBe(12332)
  })
})

describe('one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helpper.usersInDb()

    const newUser = {
      username: 'testiUserName',
      name: 'testiName',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helpper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('username must be unique', async () => {
    const usersAtStart = await helpper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helpper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('username lenght must be at least 3', async () => {
    const usersAtStart = await helpper.usersInDb()

    const newUser = {
      username: 'as',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Path `username` (`as`) is shorter than the minimum allowed length (3)')

    const usersAtEnd = await helpper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('password lenght must be at least 3', async () => {
    const usersAtStart = await helpper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Superuser',
      password: '23',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password lenght must be at least 3')

    const usersAtEnd = await helpper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})