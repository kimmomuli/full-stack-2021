const notificationReducer = (state = null, action) => {
  //console.log('STATE -->', state)
  //console.log('action -->', action)
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.message

  case 'REMOVE_NOTIFICATION':
    return null

  default:
    return state
  }
}

let timeoutId

export const createNotification = message => {
  return async dispatch =>  {
    dispatch({
      type: 'SET_NOTIFICATION',
      message
    })

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch({
        type: 'REMOVE_NOTIFICATION'
      })
    }, 5000)
  }
}

export default notificationReducer