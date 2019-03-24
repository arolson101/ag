import { Gql, useMutation, useQuery } from '@ag/util'
import debug from 'debug'
import gql from 'graphql-tag'
import React, { useCallback } from 'react'
import ReactSplitPane from 'react-split-pane'
import * as T from '../electron-graphql-types'

const log = debug('electron:SplitPane')

const queries = {
  SidebarWidth: gql`
    query SidebarWidth {
      appDb {
        get(key: "sidebarWidth") {
          key
          value
        }
      }
    }
  ` as Gql<T.SidebarWidth.Query, T.SidebarWidth.Variables>,
}

const mutations = {
  SetSidebarWidth: gql`
    mutation SetSidebarWidth($value: String!) {
      set(key: "sidebarWidth", value: $value) {
        key
        value
      }
    }
  ` as Gql<T.SetSidebarWidth.Mutation, T.SetSidebarWidth.Variables>,
}

interface Props {}

export const SplitPane: React.FC<Props> = ({ children }) => {
  const { loading, data, error } = useQuery(queries.SidebarWidth)
  const setSidebarWidthMutation = useMutation(mutations.SetSidebarWidth, {
    refetchQueries: [{ query: queries.SidebarWidth }],
  })
  const setSidebarWidth = useCallback(
    (width: number) => {
      log('setSidebarWidth %d', width)
      setSidebarWidthMutation({ variables: { value: width.toString() } })
    },
    [setSidebarWidthMutation]
  )

  const sidebarWidth =
    !loading && data && data.appDb && data.appDb.get ? parseFloat(data.appDb.get.value) : 150
  // log('render %o', data)

  return (
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
  )
}
