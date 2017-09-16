# Cartola
**Dependency Container** for universal Services using the Functional Factory Pattern.

[![Build Status](https://travis-ci.org/choko-org/cartola.svg?branch=master)](https://travis-ci.org/choko-org/cartola)

### Why you should use Cartola?
1. Dependency container helps to maintain the interoperability in your system.
2. Service's creation is lazy by default.
3. You need to import the service creator in order to use, so is easy to find it's source / code / file, it's explicit.

### Basic usage:

```js
// @file: /services/cmsApi.js

import superagentUse from 'superagent-use'
import superagent from 'superagent'

// Universal Service.
const cmsApi = ({ host, key }) => {
  const request = superagentUse(superagent)

  // Superagent middleware.
  request.use(req => {
    // Presets the Authorization Barer for all requests.
    req.set('Authorization', 'Barer ' + key)
    return req
  })

  return request
}

export default cmsApi
```

```js
// @file: /index.js

import createContainer from 'cartola'
import cmsApi from './services/cmsApi'

// Lazy service creation of your REST client.
container.defineService(cmsApi, {
  host: 'http://rest.example.com',
  key: '89asfudf7g5g75hg6h454ghj64ghj54'
})

function appOne({ container }) {
  // Api client is created for the first time.
  const api = container.get(cmsApi)

  // Get the content through the service.
  const content = api.getContent(1231)
}

function appTwo({ container }) {
  // Api client is already created.
  const api = container.get(cmsApi)

  // Get the content through the service.
  const content = api.getContent(1232)
}

// Here's where you inject the container.
appOne({ container })

setTimeOut(() => {
  appTwo({ container })
}, 1000)
```
