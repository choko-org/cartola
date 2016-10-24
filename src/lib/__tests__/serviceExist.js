import test from 'tape'
import serviceExist from '../serviceExist'

test('Service exists checks by the name of createService function', assert => {
  const mockServiceCreator = () => ({})
  const mockServiceToCompare = { name: 'mockServiceCreator' }

  const result = serviceExist(mockServiceCreator)(mockServiceToCompare)
  assert.ok(result, 'Truthy scenario.')

  const mockServiceCreatorTwo = () => ({})
  const resultFalsy = serviceExist(mockServiceCreatorTwo)(mockServiceToCompare)
  assert.notOk(resultFalsy, 'Falsy scenario.')
  assert.end()
})
