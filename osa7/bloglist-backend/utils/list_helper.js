// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((prev, cur) => prev + cur.likes, 0)
  return likes
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, cur) => prev.likes > cur.likes ? prev : cur
  
  const favorite = blogs.length !== 0
    ? blogs.reduce(reducer, blogs[0])
    : null

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counter = new Map()
  blogs.forEach(blog => {
    if (counter.has(blog.author)) {
      const currentCounter = counter.get(blog.author)
      counter.set(blog.author, currentCounter + 1)
    } else {
      counter.set(blog.author, 1)
    }
  })

  let biggestCount = 0
  let biggestCountAuthor = ''

  counter.forEach((value, key) => {
    if (value > biggestCount) {
      biggestCount = value
      biggestCountAuthor = key
    }
  })

  return {
    author: biggestCountAuthor,
    blogs: biggestCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counter = new Map()
  blogs.forEach(blog => {
    if (counter.has(blog.author)) {
      const currentCounter = counter.get(blog.author)
      counter.set(blog.author, currentCounter + blog.likes)
    } else {
      counter.set(blog.author, blog.likes)
    }
  })

  let biggestCount = 0
  let biggestCountAuthor = ''

  counter.forEach((value, key) => {
    if (value > biggestCount) {
      biggestCount = value
      biggestCountAuthor = key
    }
  })

  return {
    author: biggestCountAuthor,
    likes: biggestCount
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}