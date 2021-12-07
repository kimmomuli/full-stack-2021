require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

console.log('connecting to ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int!
    id: ID!
    born: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {

      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })

        return await Book.find({
          $and: [{ author: { $in: author.id } }, { genres: { $in: args.genre } }]
        }).populate("author")
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        return await Book.find({ author: { $in: author.id } }).populate("author")
      }

      if (args.genre) {
        return await Book.find({ genres: { $in: args.genre } }).populate("author")
      }

      return await Book.find({}).populate('author')
    },
    allAuthors: async () => {
      return await Author.find({})
    },
    me: (root, args, context) => context.currentUser
  },
  Author: {
    name: (root) => root.name,
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const isAuthorExist = await Author.findOne({ name: args.author })

      if (!isAuthorExist) {
        const newAuthor = new Author({ name: args.author })
        await newAuthor.save()
        const newBook = new Book({ ...args, author: newAuthor.id })
        try {
          const savedBook = await newBook.save()

          const result = await Book.populate(savedBook, { path: "author" })
          pubsub.publish('BOOK_ADDED', { bookAdded: result })
          
          return result
        } catch (error) {
          throw new UserInputError('invalid input', { invalidArgs: args })
        }
      }

      const newBook = new Book({ ...args, author: isAuthorExist.id })
      try {
        const savedBook = await newBook.save()

        const result = await Book.populate(savedBook, { path: "author" })
        pubsub.publish('BOOK_ADDED', { bookAdded: result })
        
        return result
      } catch (error) {
        throw new UserInputError('invalid input', { invalidArgs: args })
      }
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
        return await author.save()
      } catch (error) {
        throw new UserInputError('invalid year', { invalidArgs: args })
      }
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
        .catch(error => {
          throw new UserInputError('invalid username or favorite genre')
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})