// tslint:disable:no-implicit-dependencies max-line-length
import { HomePage } from '@ag/app'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MockApp } from './helpers'

const emptyResponse = {
  appDb: {
    banks: [],
    __typename: 'AppDb',
  },
}

const fullResponse = {
  appDb: {
    banks: [
      {
        id: 'cjrppf2gu00004a5teluf373k',
        name: 'UW Credit Union',
        favicon:
          '{"from":"http://www.uwcu.org/","source":[{"width":16,"height":16,"uri":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHElEQVR4AaXBzyuDYQDA8e/7bDm9TsSBq79g7SD/B1HCAQd/gRNbTkpylQPtsFY4UDsoB2ktP0qSMBNWmt5mo722d3u8PaYc1mNrr/b5GPyS+YLKrqxR2N2jmn3lhxkM0DU2TPf4KMLvN2jAoObz4lLdj0wgLYtGOocGGYht4TNNA41wbVs9TM4iLYtmiokkmfkFGhEvS8tUnjO0kotEKSZPFBrxFtvGq1wkik58Fd7xqnyXQufnHxInp9Qo6oiO/j68SrsSneiZnsILiWKnWkIneudmMIMBWtlwbNKuROcLhcOh1eTxonOTovL4hE6iWHdsNp0iir8M6uT34+rj4JDS1TVH52fcupJ4tUzalTRj0JzCA0GbBG0StOkb5Lpwz7f9C7EAAAAASUVORK5CYII="},{"width":16,"height":16,"uri":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA40lEQVR4AaXBL0sDcQAA0LefBoPCsTTOJJjEIIyZBD+AFpPJNPBLWM1iMPkH1sWmdtPCFaNhybA82NC523EKGsa54cneq/iRRHEVJzjEqm9ttHDT6HUzU1R8SaK4jnvUTPeE/UavO1AQkihexi1qZtvFuSkCTrHmb80kincUBBwpr6kgoKq8DQWL/uF5PNpGbkLAq5I6Waoo4EIJqdzd6E1RwBna/nA9HOhkqaKFq2E/P15aecAm1hWkcpfDgdawL/dbxYQkig+wh61k/FF/yVKPo3edLDVLxWy5EoI5BXMK5vQJMPRBgnQTqm4AAAAASUVORK5CYII="}]}',
        accounts: [],
        __typename: 'Bank',
      },
      {
        id: 'cjrx0x01o00004a5su6y9gz7d',
        name: 'Citibank',
        favicon:
          '{"source":[{"width":16,"height":16,"uri":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyElEQVR4AaXBi23DMAxF0UvVgziT8Hky0aN0E3KUTKJaQIIWRX+ozrFxYUFjUeMXVQVmVBVf2fiJGQ6cEXSJ6Yyg987TxnfMqEzcHVXBGEzdDCJgDKaXuPBQVdzvd/Z9p44Dd2e63V4xKyRBBHUc7PvOtHGpKqTkKROkJBOkZIoAqZCSCHB3po2LlGQKd+ddMo3RMTvJFO4OJB81Htyd/2g8nOfJVFVUFX/VuIzRiQCzEyn5LFNISVUxSeLJxoUFjUWNRY1FjUVvZcFV+XyE+6IAAAAASUVORK5CYII="},{"width":32,"height":32,"uri":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACl0lEQVR4AcXBMWscRxiA4XeW2VKVrlIRUlxqIb4rlqv0F9ylumIRe5gp07hQoeIKNy6XMIPYwkVq/wRBwAyBD0WQ8kABQwLBlVVeMbndLMdmkUmUYO3zGGstU8qYWMbEMiaWMbGMiVn+p12Mic0GPnwAVQ5EQASk4tO333B8fGx4hLHW8l/sYkxsNvDuHQciHKhyIALekxeFYcRYa3mqXV0n1ms6IlBV5M4ZRnZ1nQgBVOl4T+6cYcBYa3mK3avLxOaKTlWRN41hoCxjOr+Ys1rODL3dq8vE5orO5RX5642hl/FUf/wGVQXekzeNYeD0NKYQlIfbLUP5643Be6gq+OVnhixPlDeNodU0fM7R2Zyx3DnDI4y1lrEYdykERZWOCDRNYeiVZUzsVZVQFLl5+/5jurneEgJ7ioggAiLgXGHYK8uY2GuawjBgGSnLmBaLwJAqezH98NOc1XJmQmBPEaHz5uUWVeUvgqqiCiJCK8ZdWiwCLWv5G8tAWcYUgtISEaqKTgigqtxc0xEBVTg6m9P67vs5D7ewDoAqVSWIwNHZnNWSAWHM0otxlxYLpeW94FxhnOPA+5icKwyPWC1nhj05jUmB84s5q+XM8C9k9FQVUBDBucIw4lxh+AIyeqp0KuFZZYyo8qwyeucXc1qqynPK6K2WMwNCqyxjYqQsY+ILsAx4D+s1hKBATFVFJwQIQRGJ6e6uMPyDNy+31HVMIcDdXWH4ms/KGHCuMN4LIgIoISghKKCICN4LLeVx3gstVWW9Vg5+paeMGWstY/f39+nH34+4ud7SOr+Ys1rODL237z+mh9stL158xcnJiWGkrmNiz7nC0KvrmI7O5qyWM8OAsdYypYyJZUwsY2IZE8uYWMbEMib2J2Tx9ZNXxshWAAAAAElFTkSuQmCC"}],"from":"http://www.citibank.com/"}',
        accounts: [],
        __typename: 'Bank',
      },
      {
        id: 'cjrx14xyr00004a5t3q5iupmw',
        name: 'Citi Cards',
        favicon:
          '{"from":"http://www.citicards.com","source":[{"width":16,"height":16,"uri":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWElEQVR4AaXBPSiEcRzA8e//7yG3cAw48pK85qVu4E6RYjmjScnGIjcYWbAwyMAoJUVyBqTkkli8lAHDiUGUTWyGe1zP3c9d3dXTFann81GShAMahwz+ICIQCsHxMZSXQzCIqqjATvMLEYGxMVheBq8XolHw+5FIBDvNb8JhME24uGA2t5HY4hJsbsL0NCJChkGW57cPzJhFSyDAS2sHhV8mh+cPDAW8VHb4iW5sU6oUGTlzSaSFwncMjK+xvn9Dc20JwYU9lFZsHd1yff9KjaeYg7MIfZ31ZBikiQjza6fcbE/iLnDxHbNImRzpJRS+53x9gpPLJ7IZ2MTjCVrqykix4gn+Q2NjxiyseAIRQUT4D4M0pRRd7dWMzuzgLnDha6smIz/PYHX3iipPEdk0NitTg2iteP/8ot9XT6C7iZTgcA+Pr+9Uedy0N3iwU5KEAxqHNA5pHPoB5nd5bVzCWHoAAAAASUVORK5CYII="},{"width":120,"height":70,"uri":"data:image/png;base64,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"}]}',
        accounts: [],
        __typename: 'Bank',
      },
    ],
    __typename: 'AppDb',
  },
}

storiesOf('Pages/HomePage', module) //
  .add('empty', () => (
    <MockApp query={HomePage.queries.HomePage} response={emptyResponse}>
      <HomePage />
    </MockApp>
  ))
  .add('full', () => (
    <MockApp query={HomePage.queries.HomePage} response={fullResponse}>
      <HomePage />
    </MockApp>
  ))
