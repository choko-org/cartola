import test from 'tape'
import createService from '../createService'
import createContainer from '../createContainer'

test('Helper: Create a Service\'s object.', assert => {
  const mockServiceCreator = () => ({ state: true })
  const container = createContainer()
  const service = createService(container.getBag())(mockServiceCreator)

  const expectedApi = ['name', 'creator', 'args', 'executedService']

  assert.looseEqual(expectedApi, Object.keys(service), 'Object is complete.')
  assert.end()
})

test('Helper: Creating new Service.', assert => {
  const mockServiceCreator = ({ status }) => ({ state: status })
  const mockServiceCreatorArgs = { status: true }

  const containerBag = []

  const service = createService(containerBag)(mockServiceCreator, mockServiceCreatorArgs)

  assert.looseEqual(mockServiceCreator.name, service.name,
    'Service\'s name is the function\'s name.'
  )
  assert.looseEqual(service.creator, mockServiceCreator,
    'Service\'s creator is stored.'
  )
  assert.looseEqual(service.args, [mockServiceCreatorArgs],
    'Service\'s arguments is stored.'
  )
  assert.looseEqual(service.executedService, null,
    'Service\'s shouldn\'t be executed at creation.'
  )
  assert.end()
})

test('Helper: Can\'t create a Service with the same name.', assert => {
  const mockServiceCreator = ({ status }) => ({ state: status })
  const mockServiceCreatorArgs = { status: true }

  const containerBag = [{ name: 'mockServiceCreator' }]
  const expectedThrowedMsg = /Service with name "mockServiceCreator" already exists./

  assert.throws(
    () => {
      createService(containerBag)(mockServiceCreator, mockServiceCreatorArgs)
    },
    expectedThrowedMsg
  )
  assert.end()
})
