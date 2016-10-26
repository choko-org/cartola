import { createContainer } from 'cartola'
import { drupalApiConnection } from './lib/apiClients'

const fetchUsers = userId => async ({ dispatch, getService }) => {

  dispatch({ type: 'FETCH_USERS', payload: { userId } })

  try {
    const api = await getService(drupalApiConnection)
    const { body: users } = await api.get('users/' + userId)
    return {
      type: 'FETCH_USERS_SUCCESS',
      payload: { users },
    }
  }
  catch (error) {
    dispatch({ type: 'FETCH_USERS_FAILED', payload: { error } })
  }
}

const reduxServicesModule = {
  middleware: ({ getState, dispatch }) => {

    const container = createContainer()

    return next => async action => {
      if (action.type === 'redux-boot/BOOT') {
        dispatch({
          type: 'REGISTER_SERVICES', payload: { container }
        })
      }

      if (typeof action === 'function') {
        return next(action({ dispatch, getState, getService: container.getService }))
      }

      return next(action)
    }
  }
}

const implementingModule = {
  middleware: store => next => action => {
    if (action.type !== 'REGISTER_SERVICES') {
      return next(action)
    }

    const { container } = action.payload

    container.defineService(drupalApiConnection, {
      host: 'http://drupal.org/api',
    })

    return next(action)
  }
}
