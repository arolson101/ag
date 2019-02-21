// tslint:disable:no-implicit-dependencies
import { BankDialog, BankForm } from '@ag/app'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  data: {
    appDb: {
      bank: null,
      __typename: 'AppDb',
    },
  },
}

const editResponse = {
  data: {
    appDb: {
      bank: {
        name: 'Citi Cards',
        web: 'http://www.citicards.com',
        address: '8787 Baypine Road\nJacksonville, FL 32256\nUSA',
        notes: '',
        favicon:
          // tslint:disable-next-line:max-line-length
          '{"source":[{"width":16,"height":16,"uri":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdElEQVQ4T7XTTSgDYBzH8e+zlSgvk4O9hAO5mDjIy5G8JCVCoXGQlbIcUEhxWNS0xQ6Ki9CkqZW2A5lS8nJQU2qhJOEm5SJvY9pzULIxyXN/Pv/f//88fxEMBoP84Yh/BWQ4pxPW1kCrBZMJodN9yhsxgbzc2Ql+PzQ3w8UFuFwSE3r9BxIZCFV1OGBhgdFZL8PGCmL2dsBmA7cbIYREvgBnlzc8PgfIyVRzfn1LUnws5cYZliwG0tQqHh5fSE1JCJ/AuX5Ix4gThUKwONaCedZLe20B/TYPedkaRruqOPBfYTZVfwVCPec1Wlm2tKFKjOPpOUBj7zy+lT5KDHa25rrZ2D35HtDXT+BfHZB64PWNwpbJ3wFZNeOceoZQKoQEilqnogdCVQ2DDpRKhWyhKDcD6/yWBEo7pqkryyVdk4zv+Dr8DELA7d09/Ta3nLR9sB770jbjPTW4No/w7p9ibCiWL9NUmf/zP4h2Pf53F6JJ8ecE70Q529FGCcDGAAAAAElFTkSuQmCC"}],"from":"http://www.citicards.com/"}',
        online: true,
        fid: '24909',
        org: 'Citigroup',
        ofx: 'https://www.accountonline.com/cards/svc/CitiOfxManager.do',
        username: '',
        password: '',
        __typename: 'Bank',
      },
      __typename: 'AppDb',
    },
  },
}

storiesOf('Dialogs/BankDialog', module)
  .add('create', () => (
    <MockApp
      query={BankForm.queries.BankForm}
      variables={{ bankId: undefined }}
      response={emptyResponse}
    >
      <BankDialog isOpen />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp
      query={BankForm.queries.BankForm}
      variables={{ bankId: 'cjr9drbdp0001415uh38a4g9j' }}
      response={editResponse}
    >
      <BankDialog isOpen bankId={'cjr9drbdp0001415uh38a4g9j'} />
    </MockApp>
  ))

storiesOf('Forms/BankForm', module)
  .add('create', () => (
    <MockApp
      query={BankForm.queries.BankForm}
      variables={{ bankId: undefined }}
      response={emptyResponse}
    >
      <BankForm onClosed={action('onClosed')} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp
      query={BankForm.queries.BankForm}
      variables={{ bankId: 'cjr9drbdp0001415uh38a4g9j' }}
      response={editResponse}
    >
      <BankForm onClosed={action('onClosed')} bankId={'cjr9drbdp0001415uh38a4g9j'} />
    </MockApp>
  ))
