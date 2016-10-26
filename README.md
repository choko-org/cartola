# Cartola
Dependency Container for universal Services using the Functional Factory Pattern.

### Basic usage:
```js
import superagentUse from 'superagent-use'
import superagent from 'superagent'
import { createContainer } from 'cartola'

// Universal Service.
const cmsApi = ({ host, key }) => {
  const request = superagentUse(superagent)

  request.use(req => {
    // Presets the Authorization Barer for all requests.
    req.set('Authorization', 'Barer ' + key)
    return req
  })

  return request
}

// Create the container were Services are going to be stored.
const container = createContainer()

// Local MongoDB connection.
container.defineService(cmsApi, {
  host: 'http://rest.example.com',
  key: '89asfudf7g5g75hg6h454ghj64ghj54'
})


function appOne({ getService }) {
  // Api client is created for the first time.
  const api = getService(cmsApi)

  // Your App One thingy....
  const content = api.getContent(1231)
}

function appTwo({ getService }) {
  // Api client is already created.
  const api = getService(cmsApi)

  // Your App Two thingy....
  const content = api.getContent(1231)
}

appOne({ getService: container.getService })

setTimeOut(() => {
  appTwo({ getService: container.getService })
}, 1000)
```
