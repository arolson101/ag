import { TableColumn, TableProps } from '@ag/core'
import * as Antd from 'antd'
import debug from 'debug'
import React from 'react'
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragDropContext,
  DragSource,
  DragSourceSpec,
  DropTarget,
  DropTargetSpec,
} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { ContextMenu } from './ContextMenu'
import { ImageSourceIcon } from './ImageSourceIcon'

const log = debug('ui-antd:Table')

const Text: React.FC = ({ children }) => <span>{children}</span>
const Title: React.FC = ({ children }) => <h3>{children}</h3>

let dragingIndex = -1

interface BodyRowProps {
  isOver: boolean
  connectDragSource: ConnectDragSource
  connectDropTarget: ConnectDropTarget
  moveRow: (a: number, b: number) => any
  style?: React.CSSProperties
  index: number
}

interface ObjectProps {
  index: number
}

class BodyRow extends React.Component<BodyRowProps> {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props
    const style: React.CSSProperties = { ...restProps.style, cursor: 'move' }

    if (isOver) {
      if (restProps.index > dragingIndex) {
        style.borderBottom = '2px solid #1890ff'
      }
      if (restProps.index < dragingIndex) {
        style.borderTop = '2px solid #1890ff'
      }
    }

    return connectDragSource(connectDropTarget(<tr {...restProps} style={style} />))
  }
}

const rowSource: DragSourceSpec<BodyRowProps, ObjectProps> = {
  beginDrag(props) {
    dragingIndex = props.index
    return {
      index: props.index,
    }
  },
}

const rowTarget: DropTargetSpec<BodyRowProps> = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index as number
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  },
}

const type = 'row'

const dragSource = DragSource(type, rowSource, connect => ({
  connectDragSource: connect.dragSource(),
}))

const dropTarget = DropTarget(type, rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))

const DragableBodyRow = dropTarget(dragSource(BodyRow))

const DragSortingTable: React.FC<TableProps> = ({
  titleText,
  titleImage,
  titleContextMenuHeader,
  titleActions,
  emptyText,
  columns,
  rowKey,
  rowContextMenu,
  data,
  moveRow,
}) => {
  const renderCell = ({ render: userRender, format }: TableColumn<any>) => (
    text: string,
    row: any,
    index: number
  ) => {
    if (format) {
      text = format(text)
    }
    return (
      <ContextMenu {...(rowContextMenu ? rowContextMenu(row) : {})}>
        <div style={{ margin: -16, padding: 16 }}>
          {userRender ? userRender(text, row, index) : text}
        </div>
      </ContextMenu>
    )
  }

  const components = {
    body: {
      row: moveRow ? DragableBodyRow : undefined,
    },
  }

  return (
    <Antd.ConfigProvider
      renderEmpty={() => (
        <div style={{ textAlign: 'center' }}>
          <span>{emptyText}</span>
        </div>
      )}
    >
      <Antd.Table
        title={
          titleText
            ? () => (
                <ContextMenu header={titleContextMenuHeader} actions={titleActions}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <Title>
                      {titleImage && <ImageSourceIcon style={{ margin: 5 }} src={titleImage} />}
                      {titleText}
                    </Title>
                  </div>
                </ContextMenu>
              )
            : undefined
        }
        onRow={(record, index) => ({
          index,
          moveRow,
        })}
        pagination={false}
        columns={columns.map(col => ({ ...col, render: renderCell(col) }))}
        components={components}
        rowKey={rowKey}
        dataSource={data}
      />
    </Antd.ConfigProvider>
  )
}

export const Table = DragDropContext(HTML5Backend)(DragSortingTable)
