import serviceExist from './lib/serviceExist'

const createService = containerBag => (serviceCreator, ...args) => {
  const alreadyExist = containerBag.some(serviceExist(serviceCreator))

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

export default createService
