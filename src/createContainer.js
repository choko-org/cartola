function createContainer (enhancer = null) {
  let container = []

  if (typeof enhancer === 'function') {
    return enhancer(createContainer)(container)
  }

  const getContainer = () => container

  const registerService = (serviceCreator, ...args) => {
    const newService = createService(container)(serviceCreator, ...args)
    container = container.concat(newService)
    return newService
  }

  const getService = serviceCreator => {
    const executedService = executeService(container)(serviceCreator)

    container = container.map(service => {
      if (service.name === serviceCreator.name) {
        return { ...service, executedService }
      }
      return service
    })

    return executedService
  }

  return { registerService, getService, getContainer }
}

export default createContainer

/*
 * Container Helpers.
 */

const createService = container => (serviceCreator, ...args) => {
  const alreadyExist = container.some(serviceExist(serviceCreator))

  if (alreadyExist) {
    throw new TypeError('Service with name "' + serviceCreator.name + '" already exists.')
  }

  const newService = {
    name: serviceCreator.name,
    creator: serviceCreator,
    args,
    executedService: null,
  }

  return newService
}

export const executeService = container => serviceCreator => {
  const existingService = container.filter(serviceExist(serviceCreator)).shift()

  if (!existingService) {
    throw new TypeError('Service "' + serviceCreator.name + '" doesn\'t exist.')
  }

  const { executedService, args: creatorArgs, fn: creator } = existingService

  if (executedService) {
    return executedService
  }

  return creator(...creatorArgs)
}

export const serviceExist = serviceCreator => service => service.name === serviceCreator.name
