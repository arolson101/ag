import { TableColumn, TableProps } from '@ag/core'
import * as Antd from 'antd'
import React from 'react'
import { ContextMenu } from './ContextMenu'
import { ImageSourceIcon } from './ImageSourceIcon'

const Text: React.FC = ({ children }) => <span>{children}</span>
const Title: React.FC = ({ children }) => <h3>{children}</h3>

export const Table: React.FC<TableProps> = ({
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
