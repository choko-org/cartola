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



const createHash = (fn, ...args) => btoa(fn.name + fn.toString() + JSON.stringify(args))
const reduxServicesModule = {
  middleware: ({ getState, dispatch }) => {

    // @TODO This container could be a containerCreator()  !!
    let container = []

    // @TODO Args could be curried.
    const getService = (serviceCreator, ...args) => {
      // @TODO Return a hash given a serviceCreator
      const hash = createHash(serviceCreator, ...args)
      const existingService = container
        .filter(
          service => service.hash === hash ||
          (args.length === 0 && service.name === serviceCreator.name)
        )
        .shift()

      if (existingService) {
        return existingService
      }

      const newService = serviceCreator(...args)
      return container.concat(newService)
    }

    return next => async action => {
      if (action.type === 'redux-boot/BOOT') {
        const actionWithServices = await dispatch({
          type: 'REGISTER_SERVICES', payload: { container }
        })

        container = actionWithServices.payload.container
      }

      if (typeof action === 'function') {
        return next(action({ getService: container.getService }))
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

    const container = action.payload.container
    const newContainer = container.concat(drupalApiConnection)
    return next({ ...action, payload: { newContainer } })
  }
}
