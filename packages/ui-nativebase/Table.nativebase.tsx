import { ActionDesc, IconName, TableProps } from '@ag/core/context'
import assert from 'assert'
import debug from 'debug'
import {
  Body,
  Button,
  H2,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  SwipeRow,
  Switch,
  Text,
} from 'native-base'
import React, { Component, useCallback } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list'
import { Image } from './NativeImage'

const log = debug('ui-nativebase:Table')

const ActionButton = Object.assign(
  React.memo<{ action?: ActionDesc; danger?: boolean; info?: boolean; active?: boolean }>(
    function _ActionButton({ action, danger, info, active }) {
      if (!action) {
        return null
      }
      return (
        <Button
          disabled={action.disabled}
          onPress={action.onClick}
          key={action.text}
          style={{ flexDirection: 'column', height: '100%' }}
          danger={danger}
          info={info}
          active={active}
        >
          <Icon active name={mapIconName(action.icon)} />
        </Button>
      )
    }
  ),
  {
    displayName: 'ActionButton',
  }
)

export const Table = React.memo<TableProps>(function _Table(props) {
  const {
    titleText,
    titleImage,
    tableEdit,
    tableDelete,
    rowAdd,
    rowDelete,
    rowEdit,
    data,
    emptyText,
    rowKey,
    columns,
  } = props

  const tableActions: React.ReactNode[] = [
    <ActionButton key='delete' action={tableDelete} danger />,
    <ActionButton key='edit' action={tableEdit} info />,
    <ActionButton key='add' action={rowAdd} active />,
  ].filter(x => !!x)

  const renderItem = useCallback(
    function _renderItem<ItemT = Record<string, any>>({
      index,
      item,
      separators,
    }: ListRenderItemInfo<ItemT>) {
      // log('renderItem %o', item)

      const rowActions: React.ReactNode[] = [
        <ActionButton key='delete' action={rowDelete ? rowDelete(item) : undefined} danger />,
        <ActionButton key='edit' action={rowEdit ? rowEdit(item) : undefined} info />,
      ].filter(x => !!x)

      return (
        <SwipeRow
          closeOnRowPress
          disableRightSwipe
          disableLeftSwipe={!rowActions}
          rightOpenValue={-75 * rowActions.length}
          right={<View style={{ flexDirection: 'row', height: '100%' }}>{rowActions}</View>}
          body={
            <View style={{ flexDirection: 'row' }}>
              {columns.map(({ dataIndex, render, align, width, format, title }, colIndex) => {
                assert(dataIndex in item)
                const itemData = (item as any)[dataIndex]
                const formatted = format ? format(itemData) : itemData
                return (
                  <React.Fragment key={dataIndex}>
                    {render ? (
                      render(formatted, item)
                    ) : (
                      <Text style={{ textAlign: align }}>{formatted}</Text>
                    )}
                  </React.Fragment>
                )
              })}
            </View>
          }
        />
      )
    },
    [...columns, rowDelete, rowEdit]
  )

  const keyExtractor = useCallback(
    (item: any) => {
      assert(rowKey in item)
      return item[rowKey]
    },
    [rowKey]
  )

  return (
    <List>
      <SwipeRow
        closeOnRowPress
        disableRightSwipe
        disableLeftSwipe={!tableActions.length}
        rightOpenValue={-75 * tableActions.length}
        body={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image id={titleImage} size={24} />
            <H2>{titleText}</H2>
          </View>
        }
        right={<View style={{ flexDirection: 'row', height: '100%' }}>{tableActions}</View>}
      />
      {data.length === 0 ? (
        <Text>{emptyText}</Text>
      ) : (
        <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
      )}
    </List>
  )
})

export const mapIconName = (icon: IconName | undefined): string => {
  if (!icon) {
    throw new Error('icon name must be specified')
  }

  // https://ionicons.com/
  switch (icon) {
    case 'url':
      return 'globe'

    case 'image':
      return 'photo'

    case 'library':
      return 'images'

    case 'trash':
      return 'trash'

    case 'edit':
      return 'create'

    case 'add':
    case 'refresh':
    case 'sync':
    default:
      return icon
  }
}
