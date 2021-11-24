import usersService from '../services/users'

const initialState = []

const allUsersReducer = (state = initialState, action) => {
  //console.log('STATE ---> ', state)
  //console.log('action --->', action)
  switch (action.type) {
  case 'GET_ALL_USERS':
    state = [...action.data]
    return state

  default:
    return state
  }
}

export const getAll = () => {
  return async dispatch => {
    const data = await usersService.getAll()
    dispatch({
      type: 'GET_ALL_USERS',
      data
    })
  }
}

export default allUsersReducer