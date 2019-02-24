import { PictureDialog } from '@ag/core'
import React from 'react'
import { action, MockApp, storiesOf } from './helpers'

const props = {
  isOpen: true,
  onSelected: action('onSelected'),
}

storiesOf('Dialogs/PictureDialog', module) //
  .add('images', () => (
    <MockApp>
      <PictureDialog {...props} url='http://www.citicards.com' />
    </MockApp>
  ))
  .add('svg', () => (
    <MockApp>
      <PictureDialog {...props} url='http://www.americanexpress.com' />
    </MockApp>
  ))
