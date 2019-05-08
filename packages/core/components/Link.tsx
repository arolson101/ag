import React, { useCallback } from 'react'
import { CoreAction } from '../actions'
import { useDispatch, useUi } from '../context'

interface Props {
  action: CoreAction
}

export const Link = Object.assign(
  React.memo<Props>(function _Link({ action, children }) {
    const dispatch = useDispatch()
    const { Link: LinkUI } = useUi()
    const onClick = useCallback(() => {
      dispatch(action)
    }, [dispatch, action])
    return <LinkUI onClick={onClick}>{children}</LinkUI>
  }),
  {
    displayName: 'Link',
  }
)
