const path = require('path')

module.exports = {
  client: {
    service: {
      name: 'ag',
      localSchemaFile: path.join(__dirname, 'packages', 'db', 'dist', 'schema.json')
    },
    includes: ['**/*.tsx'],
    excludes: ['**/dist/**', '**/node_modules/**', '*.asar']
  },
}
