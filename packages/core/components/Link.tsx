import React, { useCallback } from 'react'
import { CoreAction } from '../actions'
import { useCoreStore, useUi } from '../context'

interface Props {
  action: CoreAction
}

export const Link = Object.assign(
  React.memo<Props>(function _Link({ action, children }) {
    const { dispatch } = useCoreStore()
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
