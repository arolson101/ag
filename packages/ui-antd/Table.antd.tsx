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
  className?: string
  index: number
}

interface ObjectProps {
  index: number
}

class BodyRow extends React.Component<BodyRowProps> {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props
    const style = { ...restProps.style, cursor: 'move' }

    let className = restProps.className
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward'
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward'
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />)
    )
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

// rowTarget.hover = rowTarget.drop

const dragSource = DragSource('row', rowSource, connect => ({
  connectDragSource: connect.dragSource(),
}))

const dropTarget = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))

const DragableBodyRow = dropTarget(dragSource(BodyRow))

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
]

class DragSortingTable extends React.Component {
  state = {
    data: [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ],
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  }

  moveRow = (dragIndex: number, hoverIndex: number) => {
    const { data } = this.state
    const dragRow = data[dragIndex]

    log('moveRow %o', data)
    // this.setState(
    //   update(this.state, {
    //     data: {
    //       $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    //     },
    //   })
    // )
  }

  render() {
    return (
      <Antd.Table
        columns={columns}
        dataSource={this.state.data}
        components={this.components}
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow,
        })}
      />
    )
  }
}

export const Table = DragDropContext(HTML5Backend)(DragSortingTable) as any

/////////////

export const Table1: React.FC<TableProps> = ({
  titleText,
  titleImage,
  titleContextMenuHeader,
  titleActions,
  emptyText,
  columns,
  rowKey,
  rowContextMenu,
  data,
}) => {
  const render = ({ render: userRender, format }: TableColumn<any>) => (
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
        pagination={false}
        columns={columns.map(col => ({ ...col, render: render(col) }))}
        rowKey={rowKey}
        dataSource={data}
      />
    </Antd.ConfigProvider>
  )
}
