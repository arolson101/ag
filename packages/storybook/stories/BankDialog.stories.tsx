// tslint:disable:max-line-length
import { BankDialog, BankForm, UrlField } from '@ag/core'
import { ImageSource } from '@ag/util'
import React from 'react'
import {
  action,
  addDelay,
  createCancelMutation,
  forever,
  MockApp,
  MockedResponse,
  storiesOf,
} from './helpers'

const cancelToken = 'cjso7o0ca00014a5uezsiw3dy'
const cancelMutation = createCancelMutation(cancelToken)
const bankId = 'cjr9drbdp0001415uh38a4g9j'

const formProps = {
  cancelToken,
  onClosed: action('onClosed'),
  loading: false,
  saveBank: action('saveBank') as any,
}

const dialogProps = {
  ...formProps,
  isOpen: true,
}

const downloadRequests: MockedResponse[] = [
  {
    request: {
      query: UrlField.queries.getFavico,
      variables: { url: 'http://www.citicards.com', cancelToken },
    },
    delay: 5000,
    result: {
      data: {
        getFavico: new ImageSource({
          width: 32,
          height: 32,
          uri:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACl0lEQVR4AcXBMWscRxiA4XeW2VKVrlIRUlxqIb4rlqv0F9ylumIRe5gp07hQoeIKNy6XMIPYwkVq/wRBwAyBD0WQ8kABQwLBlVVeMbndLMdmkUmUYO3zGGstU8qYWMbEMiaWMbGMiVn+p12Mic0GPnwAVQ5EQASk4tO333B8fGx4hLHW8l/sYkxsNvDuHQciHKhyIALekxeFYcRYa3mqXV0n1ms6IlBV5M4ZRnZ1nQgBVOl4T+6cYcBYa3mK3avLxOaKTlWRN41hoCxjOr+Ys1rODL3dq8vE5orO5RX5642hl/FUf/wGVQXekzeNYeD0NKYQlIfbLUP5643Be6gq+OVnhixPlDeNodU0fM7R2Zyx3DnDI4y1lrEYdykERZWOCDRNYeiVZUzsVZVQFLl5+/5jurneEgJ7ioggAiLgXGHYK8uY2GuawjBgGSnLmBaLwJAqezH98NOc1XJmQmBPEaHz5uUWVeUvgqqiCiJCK8ZdWiwCLWv5G8tAWcYUgtISEaqKTgigqtxc0xEBVTg6m9P67vs5D7ewDoAqVSWIwNHZnNWSAWHM0otxlxYLpeW94FxhnOPA+5icKwyPWC1nhj05jUmB84s5q+XM8C9k9FQVUBDBucIw4lxh+AIyeqp0KuFZZYyo8qwyeucXc1qqynPK6K2WMwNCqyxjYqQsY+ILsAx4D+s1hKBATFVFJwQIQRGJ6e6uMPyDNy+31HVMIcDdXWH4ms/KGHCuMN4LIgIoISghKKCICN4LLeVx3gstVWW9Vg5+paeMGWstY/f39+nH34+4ud7SOr+Ys1rODL237z+mh9stL158xcnJiWGkrmNiz7nC0KvrmI7O5qyWM8OAsdYypYyJZUwsY2IZE8uYWMbEMib2J2Tx9ZNXxshWAAAAAElFTkSuQmCC',
        }),
      },
    },
  },
]

const emptyData = {
  appDb: {
    bank: null,
    __typename: 'AppDb',
  },
}

const emptyMocks: MockedResponse[] = [
  {
    request: {
      query: BankForm.queries.BankForm,
      variables: { bankId: undefined },
    },
    result: {
      data: emptyData,
    },
  },
  ...downloadRequests,
  cancelMutation,
]

const editMocks: MockedResponse[] = [
  {
    request: {
      query: BankForm.queries.BankForm,
      variables: { bankId },
    },
    result: {
      data: {
        appDb: {
          bank: {
            name: 'Citi Cards',
            web: 'http://www.citicards.com',
            address: '8787 Baypine Road\nJacksonville, FL 32256\nUSA',
            notes: '',
            favicon: new ImageSource({
              width: 32,
              height: 32,
              uri:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACl0lEQVR4AcXBMWscRxiA4XeW2VKVrlIRUlxqIb4rlqv0F9ylumIRe5gp07hQoeIKNy6XMIPYwkVq/wRBwAyBD0WQ8kABQwLBlVVeMbndLMdmkUmUYO3zGGstU8qYWMbEMiaWMbGMiVn+p12Mic0GPnwAVQ5EQASk4tO333B8fGx4hLHW8l/sYkxsNvDuHQciHKhyIALekxeFYcRYa3mqXV0n1ms6IlBV5M4ZRnZ1nQgBVOl4T+6cYcBYa3mK3avLxOaKTlWRN41hoCxjOr+Ys1rODL3dq8vE5orO5RX5642hl/FUf/wGVQXekzeNYeD0NKYQlIfbLUP5643Be6gq+OVnhixPlDeNodU0fM7R2Zyx3DnDI4y1lrEYdykERZWOCDRNYeiVZUzsVZVQFLl5+/5jurneEgJ7ioggAiLgXGHYK8uY2GuawjBgGSnLmBaLwJAqezH98NOc1XJmQmBPEaHz5uUWVeUvgqqiCiJCK8ZdWiwCLWv5G8tAWcYUgtISEaqKTgigqtxc0xEBVTg6m9P67vs5D7ewDoAqVSWIwNHZnNWSAWHM0otxlxYLpeW94FxhnOPA+5icKwyPWC1nhj05jUmB84s5q+XM8C9k9FQVUBDBucIw4lxh+AIyeqp0KuFZZYyo8qwyeucXc1qqynPK6K2WMwNCqyxjYqQsY+ILsAx4D+s1hKBATFVFJwQIQRGJ6e6uMPyDNy+31HVMIcDdXWH4ms/KGHCuMN4LIgIoISghKKCICN4LLeVx3gstVWW9Vg5+paeMGWstY/f39+nH34+4ud7SOr+Ys1rODL237z+mh9stL158xcnJiWGkrmNiz7nC0KvrmI7O5qyWM8OAsdYypYyJZUwsY2IZE8uYWMbEMib2J2Tx9ZNXxshWAAAAAElFTkSuQmCC',
            }),
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
    },
  },
  ...downloadRequests,
  cancelMutation,
]

storiesOf('Dialogs/BankDialog', module)
  .add('create', () => (
    <MockApp mocks={emptyMocks}>
      <BankDialog {...dialogProps} />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp mocks={editMocks}>
      <BankDialog {...dialogProps} bankId={bankId} />
    </MockApp>
  ))
  .add('edit (slow)', () => (
    <MockApp mocks={addDelay(editMocks, 1000)}>
      <BankDialog {...dialogProps} bankId={bankId} />
    </MockApp>
  ))
  .add('edit (forever)', () => (
    <MockApp mocks={addDelay(editMocks, forever)}>
      <BankDialog {...dialogProps} bankId={bankId} />
    </MockApp>
  ))

storiesOf('Forms/BankForm', module)
  .add('create', () => (
    <MockApp>
      <BankForm.Component
        {...formProps} //
        data={(emptyMocks[0].result as any).data}
      />
    </MockApp>
  ))
  .add('edit', () => (
    <MockApp>
      <BankForm.Component
        {...formProps} //
        bankId={bankId}
        data={(editMocks[0].result as any).data}
      />
    </MockApp>
  ))
  .add('load forever', () => (
    <MockApp>
      <BankForm.Component
        {...formProps}
        loading={true}
        bankId={bankId}
        data={(editMocks[0].result as any).data}
      />
    </MockApp>
  ))
