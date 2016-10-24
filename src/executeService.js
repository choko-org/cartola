import serviceExist from './lib/serviceExist'

const executeService = containerBag => serviceCreator => {
  const existingService = containerBag.filter(serviceExist(serviceCreator)).shift()

  if (!existingService) {
    throw new TypeError('Service "' + serviceCreator.name + '" doesn\'t exist.')
  }

  const { executedService, args: creatorArgs, creator } = existingService

  if (executedService) {
    return executedService
  }

  return creator(...creatorArgs)
}

export default executeService
