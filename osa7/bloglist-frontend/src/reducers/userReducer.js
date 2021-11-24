import loginService from '../services/login'
import blogService from '../services/blogs'

const loggedUserJSON = window.localStorage.getItem('loggedUser')

const initialState = loggedUserJSON ? loggedUserJSON : null
if (loggedUserJSON) {
  const user = JSON.parse(loggedUserJSON)
  blogService.setToken(user.token)
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {

  case 'LOG_OUT':
    state = null
    return state

  case 'LOGIN':
    state = { ...action.data }
    return state

  default:
    return state
  }
}

export const logOut = () => {
  return async dispatch => {
    dispatch({
      type: 'LOG_OUT'
    })
  }
}

export const login = (username, password) => {
  return async dispatch => {
    const data = await loginService.login({
      username, password,
    })

    dispatch({
      type: 'LOGIN',
      data
    })

    window.localStorage.setItem(
      'loggedUser', JSON.stringify(data)
    )
  }
}

export default userReducer