// tslint:disable:max-line-length
import { AccountsPage } from '@ag/core'
import React from 'react'
import { MockApp, storiesOf } from './helpers'

const emptyMocks = [
  {
    request: { query: AccountsPage.queries.AccountsPage },
    result: {
      data: {
        appDb: {
          banks: [],
          __typename: 'AppDb',
        },
      },
    },
  },
]

const fullMocks = [
  {
    request: { query: AccountsPage.queries.AccountsPage },
    result: {
      data: {
        appDb: {
          banks: [
            {
              id: 'cjs8g926v00004a5t2hior4uf',
              name: 'Citibank',
              online: false,
              favicon: {
                width: 32,
                height: 32,
                uri:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACl0lEQVR4AcXBMWscRxiA4XeW2VKVrlIRUlxqIb4rlqv0F9ylumIRe5gp07hQoeIKNy6XMIPYwkVq/wRBwAyBD0WQ8kABQwLBlVVeMbndLMdmkUmUYO3zGGstU8qYWMbEMiaWMbGMiVn+p12Mic0GPnwAVQ5EQASk4tO333B8fGx4hLHW8l/sYkxsNvDuHQciHKhyIALekxeFYcRYa3mqXV0n1ms6IlBV5M4ZRnZ1nQgBVOl4T+6cYcBYa3mK3avLxOaKTlWRN41hoCxjOr+Ys1rODL3dq8vE5orO5RX5642hl/FUf/wGVQXekzeNYeD0NKYQlIfbLUP5643Be6gq+OVnhixPlDeNodU0fM7R2Zyx3DnDI4y1lrEYdykERZWOCDRNYeiVZUzsVZVQFLl5+/5jurneEgJ7ioggAiLgXGHYK8uY2GuawjBgGSnLmBaLwJAqezH98NOc1XJmQmBPEaHz5uUWVeUvgqqiCiJCK8ZdWiwCLWv5G8tAWcYUgtISEaqKTgigqtxc0xEBVTg6m9P67vs5D7ewDoAqVSWIwNHZnNWSAWHM0otxlxYLpeW94FxhnOPA+5icKwyPWC1nhj05jUmB84s5q+XM8C9k9FQVUBDBucIw4lxh+AIyeqp0KuFZZYyo8qwyeucXc1qqynPK6K2WMwNCqyxjYqQsY+ILsAx4D+s1hKBATFVFJwQIQRGJ6e6uMPyDNy+31HVMIcDdXWH4ms/KGHCuMN4LIgIoISghKKCICN4LLeVx3gstVWW9Vg5+paeMGWstY/f39+nH34+4ud7SOr+Ys1rODL237z+mh9stL158xcnJiWGkrmNiz7nC0KvrmI7O5qyWM8OAsdYypYyJZUwsY2IZE8uYWMbEMib2J2Tx9ZNXxshWAAAAAElFTkSuQmCC',
              },
              accounts: [],
              __typename: 'Bank',
            },
            {
              id: 'cjsckksbw00004a5tnvmnur9k',
              name: 'American Express',
              online: false,
              favicon: {
                width: 45,
                height: 45,
                uri:
                  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI0NXB4IiBoZWlnaHQ9IjQ1cHgiIHZpZXdCb3g9IjAgMCA0NSA0NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUgNDU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDojMDA2RkNGO30KPC9zdHlsZT4KPGc+Cgk8cG9seWdvbiBpZD0ibG9nby1ibHVlLWJveC1zbWFsbC00NS05eDQ1LWEiIGNsYXNzPSJzdDAiIHBvaW50cz0iNDQuOSw0NC45IDAsNDQuOSAwLDAgNDQuOSwwIAkiLz4KPC9nPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC4xMikiPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTQ0LjksMjQuMlYtMC4xSDB2NDQuOWg0NC45VjMxLjdDNDQuOCwzMS43LDQ0LjksMjQuMiw0NC45LDI0LjIiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zOS40LDIxLjdoMy40di03LjloLTMuN3YxLjFsLTAuNy0xLjFoLTMuMnYxLjRsLTAuNi0xLjRoLTUuMmMtMC4yLDAtMC41LDAtMC43LDBzLTAuNCwwLjEtMC42LDAuMQoJCXMtMC4zLDAuMS0wLjUsMC4yYy0wLjIsMC4xLTAuMywwLjEtMC41LDAuMnYtMC4ydi0wLjNIMTAuMmwtMC41LDEuM2wtMC41LTEuM2gtNHYxLjRsLTAuNi0xLjRIMS40TDAsMTcuMnY0LjVoMi4zbDAuNC0xLjFoMC44CgkJbDAuNCwxLjFoMTcuNnYtMWwwLjcsMWg0Ljl2LTAuMnYtMC40YzAuMSwwLjEsMC4zLDAuMSwwLjQsMC4yczAuMywwLjEsMC40LDAuMmMwLjIsMC4xLDAuNCwwLjEsMC42LDAuMXMwLjUsMCwwLjcsMGgyLjlsMC40LTEuMQoJCWgwLjhsMC40LDEuMWg0Ljl2LTFMMzkuNCwyMS43eiBNNDQuOSwzMS43di03LjRIMTcuNGwtMC43LDFsLTAuNy0xSDh2Ny45aDhsMC43LTFsMC43LDFoNXYtMS43aC0wLjJjMC43LDAsMS4zLTAuMSwxLjgtMC4zdjIuMQoJCWgzLjZ2LTFsMC43LDFoMTQuOUM0My44LDMyLjEsNDQuNCwzMiw0NC45LDMxLjdMNDQuOSwzMS43eiIvPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTQzLjIsMjkuOGgtMi43djEuMWgyLjZjMS4xLDAsMS44LTAuNywxLjgtMS43cy0wLjYtMS41LTEuNi0xLjVoLTEuMmMtMC4zLDAtMC41LTAuMi0wLjUtMC41czAuMi0wLjUsMC41LTAuNQoJCWgyLjNsMC41LTEuMWgtMi43Yy0xLjEsMC0xLjgsMC43LTEuOCwxLjZjMCwxLDAuNiwxLjUsMS42LDEuNWgxLjJjMC4zLDAsMC41LDAuMiwwLjUsMC41QzQzLjgsMjkuNiw0My42LDI5LjgsNDMuMiwyOS44TDQzLjIsMjkuOAoJCXogTTM4LjMsMjkuOGgtMi43djEuMWgyLjZjMS4xLDAsMS44LTAuNywxLjgtMS43cy0wLjYtMS41LTEuNi0xLjVoLTEuMmMtMC4zLDAtMC41LTAuMi0wLjUtMC41czAuMi0wLjUsMC41LTAuNWgyLjNsMC41LTEuMWgtMi43CgkJYy0xLjEsMC0xLjgsMC43LTEuOCwxLjZjMCwxLDAuNiwxLjUsMS42LDEuNWgxLjJjMC4zLDAsMC41LDAuMiwwLjUsMC41QzM4LjksMjkuNiwzOC42LDI5LjgsMzguMywyOS44TDM4LjMsMjkuOHogTTM0LjgsMjYuNnYtMS4xCgkJaC00LjJ2NS4zaDQuMnYtMS4xaC0zdi0xLjFoMi45di0xLjFoLTIuOXYtMWgzVjI2LjZ6IE0yOCwyNi42YzAuNSwwLDAuNywwLjMsMC43LDAuNmMwLDAuMy0wLjIsMC42LTAuNywwLjZoLTEuNXYtMS4zTDI4LDI2LjYKCQlMMjgsMjYuNnogTTI2LjUsMjguOWgwLjZsMS42LDEuOWgxLjVsLTEuOC0yYzAuOS0wLjIsMS40LTAuOCwxLjQtMS42YzAtMS0wLjctMS43LTEuOC0xLjdoLTIuOHY1LjNoMS4yTDI2LjUsMjguOUwyNi41LDI4Ljl6CgkJIE0yMy4zLDI3LjNjMCwwLjQtMC4yLDAuNy0wLjcsMC43SDIxdi0xLjRoMS41QzIzLDI2LjYsMjMuMywyNi45LDIzLjMsMjcuM0wyMy4zLDI3LjN6IE0xOS44LDI1LjV2NS4zSDIxVjI5aDEuNgoJCWMxLjEsMCwxLjktMC43LDEuOS0xLjhjMC0xLTAuNy0xLjgtMS44LTEuOEwxOS44LDI1LjVMMTkuOCwyNS41eiBNMTgsMzAuOGgxLjVsLTIuMS0yLjdsMi4xLTIuNkgxOGwtMS4zLDEuN2wtMS4zLTEuN2gtMS41CgkJbDIuMSwyLjZsLTIuMSwyLjZoMS41bDEuMy0xLjdMMTgsMzAuOHogTTEzLjUsMjYuNnYtMS4xSDkuM3Y1LjNoNC4ydi0xLjFoLTN2LTEuMWgyLjl2LTEuMWgtMi45di0xaDNWMjYuNnogTTM3LjgsMTcuMmwyLjEsMy4yCgkJaDEuNXYtNS4zaC0xLjJ2My41bC0wLjMtMC41bC0xLjktM2gtMS42djUuM2gxLjJ2LTMuNkwzNy44LDE3LjJ6IE0zMi42LDE3LjFMMzMsMTZsMC40LDEuMWwwLjUsMS4yaC0xLjhMMzIuNiwxNy4xeiBNMzQuNywyMC40SDM2CgkJbC0yLjMtNS4zaC0xLjZsLTIuMyw1LjNoMS4zbDAuNS0xLjFoMi42TDM0LjcsMjAuNHogTTI5LjEsMjAuNEwyOS4xLDIwLjRsMC41LTEuMWgtMC4zYy0wLjksMC0xLjQtMC42LTEuNC0xLjV2LTAuMQoJCWMwLTAuOSwwLjUtMS41LDEuNC0xLjVoMS4zdi0xLjFoLTEuNGMtMS42LDAtMi41LDEuMS0yLjUsMi42djAuMUMyNi43LDE5LjQsMjcuNiwyMC40LDI5LjEsMjAuNEwyOS4xLDIwLjR6IE0yNC42LDIwLjRoMS4yVjE4CgkJdi0yLjhoLTEuMnYyLjdWMjAuNHogTTIyLDE2LjJjMC41LDAsMC43LDAuMywwLjcsMC42YzAsMC4zLTAuMiwwLjYtMC43LDAuNmgtMS41di0xLjNMMjIsMTYuMkwyMiwxNi4yeiBNMjAuNSwxOC41aDAuNmwxLjYsMS45CgkJaDEuNWwtMS44LTJjMC45LTAuMiwxLjQtMC44LDEuNC0xLjZjMC0xLTAuNy0xLjctMS44LTEuN2gtMi44djUuM2gxLjJMMjAuNSwxOC41TDIwLjUsMTguNXogTTE4LjMsMTYuMnYtMS4xaC00LjJ2NS4zaDQuMnYtMS4xaC0zCgkJdi0xLjFoMi45di0xLjFoLTIuOXYtMWgzVjE2LjJ6IE05LjIsMjAuNGgxLjFsMS41LTQuM3Y0LjNIMTN2LTUuM2gtMmwtMS4yLDMuNmwtMS4yLTMuNmgtMnY1LjNoMS4ydi00LjNMOS4yLDIwLjR6IE0yLjcsMTcuMQoJCUwzLjEsMTZsMC40LDEuMUw0LDE4LjNIMi4yTDIuNywxNy4xeiBNNC44LDIwLjRoMS4zbC0yLjMtNS4zSDIuM0wwLDIwLjRoMS4zbDAuNS0xLjFoMi42TDQuOCwyMC40eiIvPgo8L2c+Cjwvc3ZnPgo=',
              },
              accounts: [],
              __typename: 'Bank',
            },
            {
              id: 'cjsckllse00014a5tf4y5oo5r',
              name: 'Chase',
              online: false,
              favicon: {
                width: 152,
                height: 152,
                uri:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAACYCAIAAACXoLd2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExODA4M0Y4OTk5MDkzMENERSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEQURCNEE2MzBDN0YxMUU1QTFDN0NCQUVCOUU5QkI1NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEQURCNEE2MjBDN0YxMUU1QTFDN0NCQUVCOUU5QkI1NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDU4MDExNzQwNzIwNjgxMTgwODM5NjE1QkNBMDYxMTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDY4MDExNzQwNzIwNjgxMTgwODNGODk5OTA5MzBDREUiLz4gPC9yZGY6RGVzY3Jp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',
              },
              accounts: [],
              __typename: 'Bank',
            },
            {
              id: 'cjsckndi900024a5t6ayom1r6',
              name: 'UW Credit Union',
              online: true,
              favicon: {
                width: 16,
                height: 16,
                uri:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHElEQVR4AaXBzyuDYQDA8e/7bDm9TsSBq79g7SD/B1HCAQd/gRNbTkpylQPtsFY4UDsoB2ktP0qSMBNWmt5mo722d3u8PaYc1mNrr/b5GPyS+YLKrqxR2N2jmn3lhxkM0DU2TPf4KMLvN2jAoObz4lLdj0wgLYtGOocGGYht4TNNA41wbVs9TM4iLYtmiokkmfkFGhEvS8tUnjO0kotEKSZPFBrxFtvGq1wkik58Fd7xqnyXQufnHxInp9Qo6oiO/j68SrsSneiZnsILiWKnWkIneudmMIMBWtlwbNKuROcLhcOh1eTxonOTovL4hE6iWHdsNp0iir8M6uT34+rj4JDS1TVH52fcupJ4tUzalTRj0JzCA0GbBG0StOkb5Lpwz7f9C7EAAAAASUVORK5CYII=',
              },

              accounts: [
                {
                  id: 'cjssfc94o00044a5um4koumke',
                  name: 'EMERGENCY FUND',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o000f4a5uml1lqjsl',
                  name: 'HOME EQUITY LINE OF CREDIT',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o000e4a5u5ep1qgfc',
                  name: 'HOME EQUITY LINE OF CREDIT',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o000d4a5uer0l1xyr',
                  name: 'Home Equity Loan',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o00084a5uer0iym1d',
                  name: 'House Bills (04)',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o00094a5uivyp1zjl',
                  name: 'Household Checking (05)',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o00024a5um1cocscl',
                  name: 'Household Savings (03)',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o00014a5u6l7k9vj6',
                  name: 'Kids (02)',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o00074a5ufts42amb',
                  name: 'My Savings',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o000b4a5usmzpopp5',
                  name: 'My Stipend',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o00034a5uo0gjpx0a',
                  name: 'Nest Egg',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o000a4a5uq9rppq3n',
                  name: 'PREMIUM CHECKING',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o000c4a5uteuz4nac',
                  name: 'RESERVE LINE OF CREDIT',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o00064a5u1mg2l1e8',
                  name: 'Social Security Reserve',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o00054a5ufe4dyxzf',
                  name: 'Taxes',
                  __typename: 'Account',
                },
                {
                  id: 'cjssfc94o000g4a5uzouudp30',
                  name: 'VISA PLATINUM CASH REWARDS',
                  __typename: 'Account',
                },
              ],
              __typename: 'Bank',
            },
          ],
          __typename: 'AppDb',
        },
      },
    },
  },
]

storiesOf('Pages/AccountsPage', module) //
  .add('empty', () => (
    <MockApp mocks={emptyMocks}>
      <AccountsPage />
    </MockApp>
  ))
  .add('full', () => (
    <MockApp>
      <AccountsPage.Component {...fullMocks[0].result as any} />
    </MockApp>
  ))
