const path = require('path')

module.exports = {
  client: {
    service: {
      name: 'ag',
      localSchemaFile: 'dist/schema.json'
    },
    includes: ['**/*.tsx'],
  },
}
