module.exports = {
  client: {
    service: {
      name: 'ag',
      localSchemaFile: './packages/app/dist/schema.json'
    },
    includes: ['./projects/**/*.*'],
  }
};
