import btoa from 'btoa'

function createContainer (enhancer) {
  if (typeof enhancer === 'function') {
    return enhancer(createContainer)
  }

  let containerState = []

  const getService = (serviceCreator, ...args) => {
    const hash = createHash(serviceCreator, ...args)

    const existingService = containerState
      .filter(serviceExist({ serviceCreator, hash, args }))
      .shift()

    if (!existingService) {
      throw new TypeError('Service "' + serviceCreator.name + '" doesn\'t exist.')
    }

    const { singleton, args: creatorArgs, creator } = existingService

    const finalSingleton = singleton || creator(...creatorArgs)
    const serviceHash = createHash(creator, ...creatorArgs)

    addToContainer({ hash: serviceHash, finalSingleton })

    return finalSingleton
  }

  const addService = (serviceCreator, ...args) => {
    const hash = createHash(serviceCreator, ...args)

    const alreadyExist = containerState
      .some(serviceExist({ serviceCreator, hash, args }))

    if (alreadyExist) {
      throw new TypeError('Service with name "' + serviceCreator.name + '" already exists.')
    }

    const newService = {
      name: serviceCreator.name,
      hash,
      creator: serviceCreator,
      args,
      singleton: null,
    }

    containerState = containerState.concat(newService)

    return newService
  }

  const getContainer = () => containerState

  const addToContainer = ({ hash, singleton }) => {
    containerState = containerState.map(service => {
      if (service.hash !== hash) {
        return service
      }

      return { ...service, singleton }
    })

    return containerState
  }

  return {
    addService,
    getService,
    getContainer,
  }
}

export const createHash = (fn, ...args) => btoa(fn.name + fn.toString() + JSON.stringify(args))
export const serviceExist = ({ serviceCreator, hash, args }) => service => service.hash === hash ||
  (args.length === 0 && service.name === serviceCreator.name)

export default createContainer
