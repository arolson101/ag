import { RootState, selectors } from '@ag/state'
import React from 'react'
import { connect } from 'react-redux'

interface StateProps {
  data: object
}

interface DispatchProps {}

interface Props {}

export class NavRootComponent extends React.PureComponent<StateProps & DispatchProps & Props> {
  render() {
    return <></>
  }
}

export const NavRoot = connect<StateProps, DispatchProps, Props, RootState>(
  state => ({
    data: selectors.getLoadData(state),
  }),
  {}
)(NavRootComponent)
