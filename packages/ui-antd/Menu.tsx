import { ActionItem } from '@ag/core/context'
import * as Antd from 'antd'
import debug from 'debug'
import React from 'react'
import { mapIconName } from './ImageSourceIcon'

const log = debug('ui-antd:Menu')

interface MenuProps {
  content: ActionItem[]
}

export const Menu = Object.assign(
  React.memo<MenuProps>(function _Menu({ content }) {
    const icons = content.some(item => item.icon)
    return (
      <Antd.Menu
        onClick={item => {
          const c = content[+item.key]
          if (c.onClick) {
            c.onClick()
          }
        }}
      >
        {content.map((item, i) =>
          item.divider ? (
            <Antd.Menu.Divider key={i} />
          ) : (
            <Antd.Menu.Item key={i} disabled={!item.onClick}>
              {icons && <Antd.Icon type={mapIconName(item.icon)} />}
              {item.text}
            </Antd.Menu.Item>
          )
        )}
      </Antd.Menu>
    )
  }),
  { displayName: 'Menu' }
)
