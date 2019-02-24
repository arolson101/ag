import { ImageSource } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql'

const log = debug('app:customTypes')

// https://19majkel94.github.io/type-graphql/docs/scalars.html

const config: GraphQLScalarTypeConfig<ImageSource, ImageSource> = {
  name: 'ImageSource',
  description: 'An object containing image data',

  parseValue(value) {
    // log('parseValue %o', value)
    if (!(value instanceof ImageSource)) {
      throw new Error('not an imagesource')
    }
    return value
  },

  serialize(value) {
    // log('serialize %o', value)
    if (!(value instanceof ImageSource)) {
      throw new Error('not an imagesource')
    }
    return value
  },

  parseLiteral(ast) {
    // log('parseLiteral %o', ast)
    if (ast.kind === Kind.STRING) {
      return ImageSource.fromString(ast.value)
    }
    assert.fail('unknown ast kind')
    return null
  },
}

export const ImageSourceScalar = new GraphQLScalarType(config)
