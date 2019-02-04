module.exports = {
  client: {
    service: {
      name: 'ag',
      localSchemaFile: './dist/schema.json'
    },
    includes: ['./projects/**/*.*'],
  }
};
