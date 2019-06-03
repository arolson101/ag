import { IconName, TableProps } from '@ag/core/context'
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

export const Table = React.memo<TableProps>(function _Table(props) {
  const { titleText, titleImage, titleActions, data, emptyText, rowKey, columns } = props

  const renderItem = useCallback(
    function _renderItem<ItemT = Record<string, any>>({
      index,
      item,
      separators,
    }: ListRenderItemInfo<ItemT>) {
      log('renderItem %o', item)
      return (
        <SwipeRow
          leftOpenValue={75}
          rightOpenValue={-75}
          left={
            <Button success onPress={() => alert('Add')}>
              <Icon active name='add' />
            </Button>
          }
          body={
            <View style={{ flexDirection: 'row' }}>
              {columns.map(({ dataIndex, render, align, width, format, title }, colIndex) => {
                assert(dataIndex in item)
                const data = (item as any)[dataIndex]
                const formatted = format ? format(data) : data
                return (
                  <React.Fragment key={dataIndex}>
                    {render ? (
                      render(formatted, item, colIndex)
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
    [...columns]
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
        disableRightSwipe
        disableLeftSwipe={!titleActions}
        rightOpenValue={-75 * (titleActions ? titleActions.length : 0)}
        body={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image src={titleImage} size={24} />
            <H2>{titleText}</H2>
          </View>
        }
        right={
          <View style={{ flexDirection: 'row', height: '100%' }}>
            {(titleActions || [])
              .filter(action => !action.divider)
              .map((action, idx) => (
                <Button
                  danger={action.danger}
                  disabled={action.disabled}
                  onPress={action.onClick}
                  key={idx}
                  style={{ flexDirection: 'column', height: '100%' }}
                >
                  <Icon active name={mapIconName(action.icon)} />
                  {/* <Text>{action.icon}</Text> */}
                </Button>
              ))}
          </View>
        }
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
