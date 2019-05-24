import assert from 'assert'
import debug from 'debug'
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql'

const log = debug('db:customTypes')

// https://19majkel94.github.io/type-graphql/docs/scalars.html

const ImageUriScalarConfig: GraphQLScalarTypeConfig<string, string> = {
  name: 'ImageUri',
  description: 'An image data URI',

  parseValue(value) {
    // log('parseValue %o', value)
    if (typeof value === 'string') {
      return value
    }

    throw new Error('not an ImageUri')
  },

  serialize(value) {
    // log('serialize %o', value)
    if (!(typeof value === 'string')) {
      throw new Error('not an ImageUri')
    }
    return value
  },

  parseLiteral(ast) {
    // log('parseLiteral %o', ast)
    if (ast.kind === Kind.STRING) {
      return ast.value
    }
    assert.fail('unknown ast kind')
    return null
  },
}

export const ImageUriScalar = new GraphQLScalarType(ImageUriScalarConfig)
