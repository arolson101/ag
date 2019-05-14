// tslint:disable:max-line-length
import { PictureDialog } from '@ag/core/dialogs'
import React from 'react'
import { action, MockApp, storiesOf } from './helpers'

const cancelToken = 'cjsmnf3gh00004a5uqmf82n64'

const props = {
  isOpen: true,
  onSelected: action('onSelected'),
  cancelToken,
}

storiesOf('Dialogs/PictureDialog', module) //
  .add('images', () => (
    <MockApp>
      <PictureDialog {...props} url='http://www.citicards.com' />
    </MockApp>
  ))
  .add('svg', () => (
    <MockApp>
      <PictureDialog {...props} url='http://americanexpress.com' />
    </MockApp>
  ))
