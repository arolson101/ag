import { UiContext } from '@ag/app'
import { ContextMenu, Menu, MenuDivider, MenuItem } from '@blueprintjs/core'
import React from 'react'

export const confirm: UiContext['confirm'] = ({ title, action, onConfirm, event }) => {
  const menu = (
    <Menu>
      <MenuDivider title={title} />
      <MenuItem text={action} onClick={onConfirm} intent='danger' />
    </Menu>
  )

  const rect = event.currentTarget.getBoundingClientRect()
  const left = rect.left
  const top = rect.bottom
  ContextMenu.show(menu, { left, top })
}
