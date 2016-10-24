const serviceExist = serviceCreator => service => {
  return service.name === serviceCreator.name
}

export default serviceExist
