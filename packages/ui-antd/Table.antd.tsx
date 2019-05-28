import { TableColumn, TableProps } from '@ag/core/context'
import * as Antd from 'antd'
import { TableComponents } from 'antd/lib/table'
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

const { Title } = Antd.Typography

let dragingIndex = -1

interface BodyRowProps {
  isOver: boolean
  connectDragSource?: ConnectDragSource
  connectDropTarget?: ConnectDropTarget
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
    const cursor = connectDragSource && connectDropTarget ? 'move' : undefined
    const style: React.CSSProperties = { ...restProps.style, cursor }

    if (isOver) {
      if (restProps.index > dragingIndex) {
        style.borderBottom = '2px solid #1890ff'
      }
      if (restProps.index < dragingIndex) {
        style.borderTop = '2px solid #1890ff'
      }
    }

    const row = <tr {...restProps} style={style} />

    if (connectDragSource && connectDropTarget) {
      return connectDragSource(connectDropTarget(row))
    } else {
      return row
    }
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

const getDragableBodyRow = (type: string) => {
  const dragSource = DragSource(type, rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))

  const dropTarget = DropTarget(type, rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }))

  const DragableBodyRow = dropTarget(dragSource(BodyRow))
  return DragableBodyRow
}

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
  dragId,
}) => {
  if (moveRow && !dragId) {
    throw new Error('moveRow specified but dragId is not')
  }
  const DragableBodyRow: React.ComponentType<any> | undefined = dragId
    ? getDragableBodyRow(dragId)
    : undefined

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

  const components: TableComponents = {
    body: {
      row: moveRow ? DragableBodyRow! : BodyRow,
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
                      {titleImage && (
                        <Antd.Avatar
                          shape='square'
                          size='large'
                          style={{ margin: 5, verticalAlign: 'middle' }}
                          src={titleImage}
                        />
                      )}
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
