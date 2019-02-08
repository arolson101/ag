// tslint:disable:no-implicit-dependencies
import { PictureDialog } from '@ag/app'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

storiesOf('Dialogs', module).add('PictureDialog', () => (
  <MockApp>
    <PictureDialog onSelected={action('onselected')} url='http://www.uwcu.org' isOpen={true} />
  </MockApp>
))
