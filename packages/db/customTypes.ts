import { ImageSource, ImageString } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { GraphQLScalarType, GraphQLScalarTypeConfig, Kind } from 'graphql'

const log = debug('db:customTypes')

// https://19majkel94.github.io/type-graphql/docs/scalars.html

const ImageSourceScalarConfig: GraphQLScalarTypeConfig<ImageSource, ImageSource> = {
  name: 'ImageSource',
  description: 'An object containing image data',

  parseValue(value) {
    // log('parseValue %o', value)
    if (value instanceof ImageSource) {
      return value
    }

    if (typeof value === 'string') {
      return ImageSource.fromString(value as ImageString)
    }

    throw new Error('not an imagesource')
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
      return ImageSource.fromString(ast.value as ImageString)
    }
    assert.fail('unknown ast kind')
    return null
  },
}

export const ImageSourceScalar = new GraphQLScalarType(ImageSourceScalarConfig)

const ImageStringScalarConfig: GraphQLScalarTypeConfig<string, string> = {
  name: 'ImageString',
  description: 'An object containing image data',

  parseValue(value) {
    // log('parseValue %o', value)
    if (typeof value === 'string') {
      return value
    }

    throw new Error('not an ImageString')
  },

  serialize(value) {
    // log('serialize %o', value)
    if (!(typeof value === 'string')) {
      throw new Error('not an ImageString')
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

export const ImageStringScalar = new GraphQLScalarType(ImageStringScalarConfig)
