const notificationAtStart = ''
let timeOut

const notificationReducer = (state = notificationAtStart, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return action.message

    case 'REMOVE_MESSAGE':
      return notificationAtStart

    default:
      return state
  }
}

export const createNotification = (message, seconds) => {
  return async dispatch => {
    dispatch({
      type: 'SET_VALUE',
      message
    })
    if (!timeOut) {
      timeOut = setTimeout(() => {
        dispatch({
          type: 'REMOVE_MESSAGE'
        })
      }, seconds * 1000)
    } else {
      clearTimeout(timeOut)
      timeOut = setTimeout(() => {
        dispatch({
          type: 'REMOVE_MESSAGE'
        })
      }, 5000)
    }
  }
}

export default notificationReducer