import { PopoverButtonProps } from '@ag/core/context'
import { Button, Dropdown, Icon, Menu } from 'antd'
import { ClickParam } from 'antd/lib/menu'
import debug from 'debug'
import React, { useCallback } from 'react'
import { mapIconName } from './mapIconName.antd'

const log = debug('ui-antd:PopoverButton')

export const PopoverButton = Object.assign(
  React.memo<PopoverButtonProps>(function _PopoverButton({
    icon,
    disabled,
    content,
    minimal,
    loading,
    children,
  }) {
    const icons = content.some(item => item.icon)
    const menuClick = useCallback(
      (item: ClickParam) => {
        const c = content[+item.key]
        if (c.onClick) {
          c.onClick()
        }
      },
      [content]
    )

    return (
      <Dropdown
        overlay={
          <Menu onClick={menuClick}>
            {content.map((item, i) =>
              item.divider ? (
                <Menu.Divider key={i} />
              ) : (
                <Menu.Item key={i} disabled={!item.onClick}>
                  {icons && <Icon type={mapIconName(item.icon)} />}
                  {item.text}
                </Menu.Item>
              )
            )}
          </Menu>
        }
        disabled={disabled}
        trigger={['click']}
      >
        <Button
          loading={loading}
          size='small'
          style={{ border: 0, backgroundColor: 'transparent' }}
        >
          {loading ? null : React.isValidElement(icon) ? icon : children}
          {minimal ? null : <Icon type='down' />}
        </Button>
      </Dropdown>
    )
  }),
  {
    displayName: 'PopoverButton',
  }
)
