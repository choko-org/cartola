import test from 'tape'
import createContainer from '../createContainer'

test('Container\'s API.', assert => {
  const container = createContainer()
  const expectedApi = ['defineService', 'getService', 'getBag']
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
  const { defineService, getBag } = container
  const newServiceDefinition = defineService(mockServiceCreator)

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
  container.defineService(mockServiceCreator, { status: true })

  const serviceOne = container.getService(mockServiceCreator)
  const serviceTwo = container.getService(mockServiceCreator)
  const serviceThree = container.getService(mockServiceCreator)

  assert.ok(serviceOne.state)

  // Service's can be mutated, but strongly not ecouraged.

  serviceOne.state = false
  assert.notOk(serviceTwo.state)
  assert.notOk(serviceThree.state)

  assert.end()
})
