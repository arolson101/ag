import React, { useCallback, useContext } from 'react'
import { CoreAction } from '../actions'
import { CoreContext } from '../context'

interface Props {
  action: CoreAction
}

export const Link = Object.assign(
  React.memo<Props>(function _Link({ action, children }) {
    const { ui, dispatch } = useContext(CoreContext)
    const { Link: LinkUI } = ui
    const onClick = useCallback(() => {
      dispatch(action)
    }, [dispatch, action])
    return <LinkUI onClick={onClick}>{children}</LinkUI>
  }),
  {
    displayName: 'Link',
  }
)
