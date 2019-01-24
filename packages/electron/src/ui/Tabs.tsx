import { TabProps, TabsProps } from '@ag/app'
import { Tab, TabId, Tabs } from '@blueprintjs/core'
import React from 'react'

interface State {
  selectedTabId: TabId
}

export class ElectronTabs extends React.PureComponent<TabsProps> {
  state: State = {
    selectedTabId: '',
  }

  render() {
    const { id, initialId, children } = this.props
    const { selectedTabId } = this.state
    return (
      <Tabs id={id} onChange={this.onTabChange} selectedTabId={selectedTabId || initialId}>
        {children}
      </Tabs>
    )
  }

  onTabChange = (newTabId: TabId, prevTabId: TabId) => {
    this.setState({ selectedTabId: newTabId })
  }
}

export const ElectronTab = Tab as React.ComponentType<TabProps>
