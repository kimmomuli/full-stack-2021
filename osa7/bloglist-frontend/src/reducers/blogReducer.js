import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  //console.log('state -->', state)
  //console.log('action -->', action)
  switch (action.type) {
  case 'ADD_BLOG':
    return state.concat(action.data)

  case 'GET_ALL':
    state = [...action.data]
    return action.data

  case 'LIKE_BLOG':
    return state
      .map(blog => blog.id === action.data.id ? { ...blog, likes: action.data.likes } : blog)

  case 'REMOVE_BLOG':
    return state.filter(b => b.id !== action.id)

  default:
    return state
  }
}

export const getAllBlogs = () => {
  return async dispatch => {
    const data = await blogService.getAll()
    dispatch({
      type: 'GET_ALL',
      data
    })
  }
}

export const addBlog = newBlog => {
  return async dispatch => {
    const data = await blogService.create(newBlog)
    dispatch({
      type: 'ADD_BLOG',
      data
    })
  }
}

export const giveLikeToBlog = (newBlog, id) => {
  return async dispatch => {
    const data = await blogService.like(newBlog, id)
    dispatch({
      type: 'LIKE_BLOG',
      data
    })
  }
}

export const removeBlogFromDb = blog => {
  return async dispatch => {
    await blogService.remove(blog.id)
    dispatch({
      type: 'REMOVE_BLOG',
      id: blog.id
    })
  }
}

export const showBlogs = () => {
  return async dispatch => {
    dispatch({
      type: null
    })
  }
}

export default blogReducer