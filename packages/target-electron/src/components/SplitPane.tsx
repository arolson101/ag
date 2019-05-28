import { ErrorDisplay } from '@ag/core/components'
import { useAction, useSelector } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import { thunks } from '@ag/core/thunks'
import debug from 'debug'
import React, { useCallback } from 'react'
import ReactSplitPane from 'react-split-pane'

const log = debug('electron:SplitPane')

const sidebarWidthKey = 'sidebarWidth'
const sidebarWidthDefault = 150

interface Props {}

export const SplitPane: React.FC<Props> = ({ children }) => {
  const error = useSelector(selectors.getSettingsError)
  const getSetting = useSelector(selectors.getSetting)
  const sidebarWidth = parseFloat(getSetting(sidebarWidthKey, sidebarWidthDefault.toString()))
  const settingsSetValue = useAction(thunks.settingsSetValue)

  const setSidebarWidth = useCallback(
    (width: number) => {
      log('setSidebarWidth %d', width)
      settingsSetValue(sidebarWidthKey, width.toString())
    },
    [settingsSetValue, sidebarWidthKey]
  )

  // log('render %o', data)

  return (
    <>
      <ErrorDisplay error={error} />
      <ReactSplitPane
        split='vertical'
        minSize={50}
        maxSize={500}
        size={sidebarWidth}
        onDragFinished={setSidebarWidth}
        resizerStyle={{
          background: '#000',
          opacity: 0.1,
          zIndex: 1,
          boxSizing: 'border-box',
          backgroundClip: 'padding-box',
          cursor: 'col-resize',
          width: 11,
          margin: '0 -5px',
          borderLeft: '5px solid rgba(255, 255, 255, 0)',
          borderRight: '5px solid rgba(255, 255, 255, 0)',
        }}
      >
        {children}
      </ReactSplitPane>
    </>
  )
}
