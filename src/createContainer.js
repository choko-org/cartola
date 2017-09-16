import createService from './createService'
import executeService from './executeService'

function createContainer (enhancer = null) {
  let containerBag = []

  if (typeof enhancer === 'function') {
    return enhancer(createContainer)(containerBag)
  }

  const getBag = () => containerBag

  const define = (serviceCreator, ...args) => {
    const newService = createService(containerBag)(serviceCreator, ...args)
    containerBag = containerBag.concat(newService)
    return newService
  }

  const get = serviceCreator => {
    const executedService = executeService(containerBag)(serviceCreator)

    // @TODO Shouldn't need to cache more than once.
    // Caching executed Service.
    containerBag = containerBag.map(service => {
      if (service.name === serviceCreator.name) {
        return { ...service, executedService }
      }
      return service
    })

    return executedService
  }

  return { define, get, getBag }
}

export default createContainer
