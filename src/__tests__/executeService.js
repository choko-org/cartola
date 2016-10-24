import test from 'tape'
import executeService from '../executeService'

test('Helper: Execute a Service.', assert => {
  const mockServiceCreator = (one, two) => ({ state: one + ' ' + two })
  const mockServiceDefinition = {
    name: 'mockServiceCreator',
    creator: mockServiceCreator,
    args: ['hell', 'yeah'],
  }
  const mockContainerBag = [mockServiceDefinition]
  const executedService = executeService(mockContainerBag)(mockServiceCreator)

  assert.looseEqual(executedService, mockServiceCreator('hell', 'yeah'),
    'Service was executed with arguments.'
  )

  const mockMissingServiceCreator = () => ({})
  const expectedThrowedMsg = /Service "mockMissingServiceCreator" doesn't exist./
  assert.throws(
    () => {
      executeService(mockContainerBag)(mockMissingServiceCreator)
    },
    expectedThrowedMsg
  )
  assert.end()
})

test('Helper: Execute a Service from previously execution.', assert => {
  const mockServiceCreator = ({ status }) => ({ state: status })
  const expectedExecutedService = mockServiceCreator({ status: false })
  const mockServiceDefinition = {
    name: 'mockServiceCreator',
    creator: mockServiceCreator,
    args: [{ status: false }],
    executedService: expectedExecutedService
  }
  const mockContainerBag = [mockServiceDefinition]
  const executedService = executeService(mockContainerBag)(mockServiceCreator)

  assert.isEqual(executedService, expectedExecutedService,
    'Executed Service from cache.'
  )

  const notExpectedExecutedService = mockServiceCreator({ status: true })
  assert.isNotEqual(executedService, notExpectedExecutedService,
    'Executed Service is really from cache.'
  )
  assert.end()
})
