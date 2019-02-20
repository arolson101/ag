// tslint:disable:no-implicit-dependencies
import { PictureDialog } from '@ag/app'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

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
