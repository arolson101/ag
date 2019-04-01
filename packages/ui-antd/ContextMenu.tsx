import { ContextMenuProps } from '@ag/core'
import { Dropdown, Icon, Menu } from 'antd'
import React from 'react'
import { mapIconName } from './ImageSourceIcon'

export const ContextMenu: React.FC<ContextMenuProps> = ({ header, actions, children }) => {
  if (actions) {
    return (
      <Dropdown
        trigger={['contextMenu']}
        overlay={
          actions && (
            <Menu
              onClick={item => {
                const action = actions[+item.key]
                if (action.onClick) {
                  action.onClick()
                }
              }}
            >
              {header && <Menu.ItemGroup title={header} />}
              {actions.map((item, i) =>
                item.divider ? (
                  <Menu.Divider key={i} />
                ) : (
                  <Menu.Item disabled={!item.onClick || item.disabled} key={i}>
                    <Icon type={mapIconName(item.icon)} />
                    {item.text}
                  </Menu.Item>
                )
              )}
            </Menu>
          )
        }
      >
        {children}
      </Dropdown>
    )
  } else {
    return <>{children}</>
  }
}
