import { ActionDesc, TableColumn, TableProps } from '@ag/core/context'
import * as Antd from 'antd'
import { TableComponents } from 'antd/lib/table'
import debug from 'debug'
import React, { useCallback, useState } from 'react'
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
import { Column as VColumn, Table as VTable } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { ContextMenu } from './ContextMenu'
import { Image } from './Image.antd'
import { mapIconName } from './ImageSourceIcon'

import arrayMove from 'array-move'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

const DragHandle = SortableHandle(() => <Antd.Icon type='menu' />)

const ROW_HEIGHT = 30

import { AutoSizer, defaultTableRowRenderer } from 'react-virtualized'

const SortableTable = SortableContainer(VTable)
const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer as any)

export const Table = React.memo<TableProps>(function _Table(props) {
  const { data, columns } = props
  const [cols] = useState([
    { dataKey: 'col1', label: 'Column1' },
    { dataKey: 'col2', label: 'Column2' },
    { dataKey: 'col3', label: 'Column13' },
  ])
  const [rows, setRows] = useState([
    { col1: 'row1 col1', col2: 'row1 col2', col3: 'row1 col3' },
    { col1: 'row2 col1', col2: 'row2 col2', col3: 'row2 col3' },
    { col1: 'row3 col1', col2: 'row3 col2', col3: 'row3 col3' },
  ])

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }: any) => {
      log('onSortEnd %d %d', oldIndex, newIndex)
      setRows(arrayMove(rows, oldIndex, newIndex))
    },
    [setRows, rows]
  )

  const sortwidth = 50
  const colwidth = columns
    .map(col => col.width!)
    .reduce((prev, current) => prev + current, sortwidth)

  return (
    <div style={{ height: '300px' }}>
      <AutoSizer>
        {({ width, height }) => (
          <SortableTable
            lockAxis='y'
            onSortEnd={onSortEnd}
            width={width}
            height={height}
            headerHeight={ROW_HEIGHT}
            rowHeight={ROW_HEIGHT}
            rowCount={data.length}
            rowGetter={({ index }) => data[index]}
            rowRenderer={params => <SortableTableRowRenderer {...params} />}
            useDragHandle
          >
            <VColumn
              dataKey='id'
              width={sortwidth / colwidth}
              cellRenderer={() => <DragHandle />}
            />
            {columns.map((col, idx) => (
              <VColumn
                key={col.dataIndex}
                dataKey={col.dataIndex}
                width={(typeof col.width === 'number' ? col.width : 0) / colwidth}
                // cellRenderer={idx === 0 ? () => <DragHandle /> : undefined}
                label={col.title}
              />
            ))}
            {/* {cols.map((col, idx) => (
              <VColumn
                {...col}
                key={col.dataKey}
                width={width / cols.length}
                cellRenderer={idx === 0 ? () => <DragHandle /> : undefined}
              />
            ))} */}
          </SortableTable>
        )}
      </AutoSizer>
    </div>
  )
})

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

const actionMenuItem = (action?: ActionDesc) =>
  action ? (
    <Antd.Menu.Item onClick={action.onClick} disabled={action.disabled}>
      <Antd.Icon type={mapIconName(action.icon)} />
      {action.text}
    </Antd.Menu.Item>
  ) : null

const DragSortingTable: React.FC<TableProps> = ({
  titleText,
  titleImage,
  tableDelete,
  tableEdit,
  emptyText,
  columns,
  rowAdd,
  rowDelete,
  rowEdit,
  rowKey,
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

  const renderCell = useCallback(
    ({ render: userRender, format }: TableColumn<any>) => (
      text: string,
      row: any,
      index: number
    ) => {
      if (format) {
        text = format(text)
      }
      const actions: ActionDesc[] = [
        rowEdit, //
        rowDelete,
      ]
        .map(fcn => fcn && fcn(row))
        .filter((action): action is ActionDesc => !!action)

      return (
        <ContextMenu actions={actions}>
          <div style={{ margin: -16, padding: 16 }}>
            {userRender ? userRender(text, row, index) : text}
          </div>
        </ContextMenu>
      )
    },
    [rowDelete, rowEdit]
  )

  const menu = (
    <Antd.Menu>
      <Antd.Menu.ItemGroup title={titleText} />
      {actionMenuItem(rowAdd)}
      <Antd.Menu.Divider />
      {actionMenuItem(tableEdit)}
      {actionMenuItem(tableDelete)}
    </Antd.Menu>
  )

  const components: TableComponents = {
    body: {
      row: moveRow ? DragableBodyRow! : BodyRow,
    },
  }

  return (
    <Antd.ConfigProvider
      renderEmpty={() => (
        <div style={{ textAlign: 'center' }}>
          <div>{emptyText}</div>
        </div>
      )}
    >
      <Antd.Table
        title={
          titleText
            ? () => (
                <div
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    <Image src={titleImage} size='1.5em' margin={5} />
                    {titleText}
                  </Title>
                  <Antd.Dropdown overlay={menu}>
                    <Antd.Button icon='ellipsis' shape='round' />
                  </Antd.Dropdown>
                </div>
              )
            : undefined
        }
        onRow={(record, index) => ({
          index,
          moveRow,
        })}
        footer={() => <div />}
        pagination={false}
        columns={columns.map(col => ({ ...col, render: renderCell(col) }))}
        components={components}
        rowKey={rowKey}
        dataSource={data}
        style={{ marginTop: 20 }}
        size='middle'
      />
    </Antd.ConfigProvider>
  )
}

export const Table1 = DragDropContext(HTML5Backend)(DragSortingTable)
