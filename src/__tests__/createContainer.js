import test from 'tape'
import createContainer from '../createContainer'

test('Container\'s API.', assert => {
  const container = createContainer()
  const expectedApi = ['define', 'get', 'getBag']
  assert.looseEqual(Object.keys(container), expectedApi, 'Api is complete.')

  const allAreFunctions = Object.keys(container)
    .every(fname => typeof container[fname] === 'function')

  assert.ok(allAreFunctions, 'All are functions.')
  assert.end()
})

test('Get Container\'s bag.', assert => {
  const container = createContainer()

  assert.ok(Array.isArray(container.getBag()),
    'Container\'s bag is an Array.'
  )
  assert.end()
})

test('Defining a new Service', assert => {
  const mockServiceCreator = ({ status }) => ({ state: status })

  const container = createContainer()
  const { define, getBag } = container
  const newServiceDefinition = define(mockServiceCreator)

  assert.ok(getBag().some(service => service.name === newServiceDefinition.name))
  assert.end()
})

test('Getting a Service', assert => {
  assert.plan(4)
  const mockServiceCreator = ({ status }) => {
    assert.pass('Service creator is executed once.')
    return { state: status }
  }

  const container = createContainer()
  container.define(mockServiceCreator, { status: true })

  const serviceOne = container.get(mockServiceCreator)
  const serviceTwo = container.get(mockServiceCreator)
  const serviceThree = container.get(mockServiceCreator)

  assert.ok(serviceOne.state)

  // Service's can be mutated, but strongly not ecouraged.

  serviceOne.state = false
  assert.notOk(serviceTwo.state)
  assert.notOk(serviceThree.state)

  assert.end()
})

test('Compose Containers with different behaviors.', assert => {
  assert.plan(2)

  const mockProxyEnhancer = createContainer => containerBag => {
    const container = createContainer()
    const { get } = container

    const mockGetServiceWithProxy = serviceCreator => {
      const service = get(serviceCreator)
      const searchProxy = query => {
        assert.pass('Function call was proxied.')
        return service.search(query)
      }
      return { ...service, search: searchProxy }
    }

    return { ...container, get: mockGetServiceWithProxy }
  }

  const mockServiceCreator = ({ host }) => ({ host, search: query => query })

  const container = createContainer(mockProxyEnhancer)
  container.define(mockServiceCreator, { host: 'local' })

  const service = container.get(mockServiceCreator)

  assert.isEqual(service.search('choko'), 'choko')
  assert.end()
})
