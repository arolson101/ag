import { PageProps } from '@ag/core/context'
import { Button, Layout, PageHeader, Typography } from 'antd'
import 'antd/dist/antd.css'
import debug from 'debug'
import { MemoryHistory } from 'history'
import 'nprogress/nprogress.css'
import React from 'react'
import useReactRouter from 'use-react-router'
import { ImageSourceIcon } from './ImageSourceIcon'

const { Title } = Typography

const log = debug('ui-antd:ui')

export const Page = Object.assign(
  React.memo<PageProps>(function _Page({ button, title, image, subtitle, children }) {
    let onBack: undefined | (() => any)
    try {
      const { history } = useReactRouter()
      const h = history as MemoryHistory
      if (h.canGo(-1)) {
        onBack = h.goBack
      }
    } catch (error) {
      log(error.message)
    }

    return (
      <Layout style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          onBack={onBack}
          title={
            <Title level={2}>
              {image && <ImageSourceIcon style={{ margin: 5 }} id={image} />}
              {title}
            </Title>
          }
          subTitle={subtitle}
        />
        <Layout.Content style={{ background: '#fff', overflow: 'auto', flex: 1 }}>
          {children}
        </Layout.Content>
        {button && (
          <Layout.Footer>
            <Button
              disabled={button.disabled}
              type={button.isDanger ? 'danger' : undefined}
              onClick={button.onClick}
            >
              {button.title}
            </Button>
          </Layout.Footer>
        )}
      </Layout>
    )
  }),
  {
    displayName: 'Page',
  }
)
