import { ActionDesc, TableColumn, TableProps } from '@ag/core/context'
import { faGripLines } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Antd from 'antd'
import { TableComponents } from 'antd/lib/table'
import arrayMove from 'array-move'
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
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEndHandler,
} from 'react-sortable-hoc'
import {
  AutoSizer,
  Column as VColumn,
  defaultTableRowRenderer,
  Table as VTable,
  TableCellProps as VTableCellProps,
  TableCellRenderer as VTableCellRenderer,
  TableHeaderProps as VTableHeaderProps,
  TableHeaderRenderer as VTableHeaderRenderer,
} from 'react-virtualized'
import 'react-virtualized/styles.css'
import { ContextMenu } from './ContextMenu'
import { Image } from './Image.antd'
import { mapIconName } from './ImageSourceIcon'
import './Table.antd.css'

const DragHandle = SortableHandle(() => (
  <span style={{ cursor: 'ns-resize' }}>
    <Antd.Icon
      style={{ color: '#00000040' }}
      component={() => <FontAwesomeIcon icon={faGripLines} />}
    />
  </span>
))

const SortableTable = SortableContainer(VTable)
const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer as any)

const drawDragHandle: VTableCellRenderer = props => <DragHandle />

export const Table = React.memo<TableProps>(function _Table(props) {
  const {
    data,
    columns,
    rowAdd,
    rowDelete,
    rowEdit,
    rowKey,
    moveRow,
    emptyText,
    titleText,
    titleImage,
    tableEdit,
    tableDelete,
  } = props

  const onSortEnd = useCallback<SortEndHandler>(
    ({ oldIndex, newIndex }) => {
      if (moveRow && oldIndex !== newIndex) {
        moveRow(oldIndex, newIndex)
      }
    },
    [moveRow]
  )

  const noRowsRenderer = useCallback(
    () => (
      <div style={{ textAlign: 'center', height: rowHeight }}>
        <Antd.Typography.Text>{emptyText}</Antd.Typography.Text>
      </div>
    ),
    [emptyText]
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

  const sortwidth = 30

  const headerRenderer = ({ align }: TableColumn<any>): VTableHeaderRenderer => props => {
    // log('headerRenderer %o', props)
    return <div style={{ textAlign: align, textTransform: 'none' }}>{props.label}</div>
  }

  const renderCell = useCallback(
    ({ render: userRender, format, align }: TableColumn<any>): VTableCellRenderer => ({
      cellData,
      rowData,
    }) => {
      if (format) {
        cellData = format(cellData)
      }
      const actions: ActionDesc[] = [
        rowEdit, //
        rowDelete,
      ]
        .map(fcn => fcn && fcn(rowData))
        .filter((action): action is ActionDesc => !!action)

      return (
        <ContextMenu actions={actions}>
          <div style={{ margin: -16, padding: 16, textAlign: align }}>
            {userRender ? userRender(cellData, rowData) : cellData}
          </div>
        </ContextMenu>
      )
    },
    [rowDelete, rowEdit]
  )

  const headerHeight = 30
  const rowHeight = 30
  const emptyHeight = rowHeight
  const height = headerHeight + (data.length ? data.length * rowHeight : emptyHeight)

  return (
    <>
      {titleText ? (
        <div
          className='ant-table-header'
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 10,
            paddingBottom: 5,
            paddingRight: 5,
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            <Image src={titleImage} size='1.5em' margin={5} />
            {titleText}
          </Title>
          <Antd.Dropdown overlay={menu}>
            <Antd.Button icon='ellipsis' shape='round' />
          </Antd.Dropdown>
        </div>
      ) : null}
      <div style={{ height }}>
        <AutoSizer>
          {({ width, height }) => {
            const columnWidths = columns.map(col => col.width || 0)
            const fixedColumns = columnWidths.reduce((count, col) => count + (col ? 1 : 0), 0)
            const fixedwidths = columnWidths.reduce((prev, cur) => prev + cur, sortwidth)
            const colwidths = columns.map(col =>
              col.width ? col.width : (width - fixedwidths) / (columns.length - fixedColumns)
            )
            // log('width: %d, colwidths: [%s]', width, colwidths.join(', '))
            return (
              <SortableTable
                lockAxis='y'
                onSortEnd={onSortEnd}
                width={width}
                height={height}
                headerHeight={headerHeight}
                rowHeight={rowHeight}
                rowCount={data.length}
                rowGetter={({ index }) => data[index]}
                rowRenderer={params => <SortableTableRowRenderer {...params} />}
                useDragHandle
                // disableHeader
                className='ant-table'
                headerClassName='ant-table-thead ant-table-header'
                rowClassName='ant-table-row ant-table-row-level-0'
                noRowsRenderer={noRowsRenderer}
              >
                <VColumn dataKey='id' width={sortwidth} cellRenderer={drawDragHandle} />
                {columns.map((col, idx) => (
                  <VColumn
                    headerRenderer={headerRenderer(col)}
                    key={col.dataIndex}
                    dataKey={col.dataIndex}
                    width={colwidths[idx]}
                    minWidth={col.width}
                    cellRenderer={renderCell(col)}
                    label={col.title}
                  />
                ))}
              </SortableTable>
            )
          }}
        </AutoSizer>
      </div>
      <div className='ant-table-footer' style={{ marginBottom: 50 }} />
      {/* <Table1 {...props} /> */}
    </>
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
            {userRender ? userRender(text, row) : text}
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
