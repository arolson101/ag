import {
  AlertParams,
  IconName,
  ListItem,
  LoadingOverlayProps,
  NavMenuItem,
  UiContext,
} from '@ag/core'
import { ImageSource } from '@ag/util'
import {
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  Icon,
  Layout,
  List,
  Menu,
  message,
  Modal,
  Spin,
  Tabs,
} from 'antd'
import 'antd/dist/antd.css'
import debug from 'debug'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import React from 'react'
import { CheckboxField } from './CheckboxField.antd'
import { CurrencyField } from './CurrencyField.antd'
import { DateField } from './DateField.antd'
import { Form } from './Form.antd'
import { Image } from './Image.antd'
import { SelectField } from './SelectField.antd'
import { TextField } from './TextField.antd'
// const { Text, Title, Paragraph } = Typography
const Text: React.FC = ({ children }) => <span>{children}</span>
const Title: React.FC<{ style: any }> = ({ style, children }) => <h3>{children}</h3>
const Paragraph: React.FC = ({ children }) => <p>{children}</p>

const log = debug('ui-antd:ui')
log.enabled = true

export const ui: UiContext = {
  // special ui
  showToast: (text, danger) => (danger ? message.error(text) : message.success(text)),
  alert: ({ title, body, danger, error, onConfirm, confirmText, onCancel, cancelText }) => {
    ;(cancelText ? Modal.confirm : error ? Modal.error : Modal.info)({
      centered: true,
      title,
      content: body,
      onOk: onConfirm,
      onCancel,
      okText: confirmText,
      okType: danger ? 'danger' : 'primary',
      cancelText,
    })
  },

  // dialog
  Dialog: ({ isOpen, title, onClose, primary, secondary, children }) => (
    <Modal
      title={title}
      visible={isOpen}
      onCancel={onClose}
      maskClosable={false}
      centered
      bodyStyle={{ maxHeight: 'calc(100vh - 325px)', overflowY: 'auto' }}
      footer={[
        secondary ? (
          <Button
            key='secondary'
            onClick={secondary.onClick}
            type={secondary.isDanger ? 'danger' : undefined}
            disabled={secondary.disabled}
          >
            {secondary.title}
          </Button>
        ) : null,
        primary ? (
          <Button
            key='primary' //
            onClick={primary.onClick}
            type='primary'
            disabled={primary.disabled}
          >
            {primary.title}
          </Button>
        ) : null,
      ]}
    >
      {children}
    </Modal>
  ),
  LoadingOverlay: class LoadingOverlay extends React.PureComponent<LoadingOverlayProps> {
    componentDidUpdate(prevProps: LoadingOverlayProps) {
      if (this.props.show !== prevProps.show) {
        this.update()
      }
    }
    componentDidMount() {
      this.update()
    }
    update() {
      const { show } = this.props
      if (show) {
        NProgress.start()
      } else {
        NProgress.done()
      }
    }
    render() {
      return null
    }
  },

  // navigation
  NavMenu: ({ items }) => (
    <Layout.Sider>
      <Menu
        defaultOpenKeys={items.flatMap(getNavMenuOpenKeys)}
        selectedKeys={items.flatMap(getNavMenuSelectedKeys)}
        selectable
        inlineIndent={10}
        mode='inline'
        style={{ height: '100%' }}
        onClick={item => {
          log('NavMenu onClick %o', item)
        }}
      >
        {items.map(buildNavMenu)}
      </Menu>
    </Layout.Sider>
  ),

  // layout
  Card: ({ image, title, children }) => (
    <Card title={title} extra={undefined}>
      <Card.Meta
        avatar={image && <ImageSourceIcon src={image} />}
        title={title}
        // description="This is the description"
      />
      {children}
    </Card>
  ),
  Row: ({ left, right, center, flex, children }) => (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex }}>
      {children}
    </div>
  ),
  Column: ({ top, bottom, center, flex, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', flex }}>{children}</div>
  ),
  Grid: ({ data, renderItem, size, onClick, flex, scrollable }) => (
    <div
      onClick={onClick}
      style={{
        padding: 5,
        display: 'grid',
        justifyContent: 'space-between',
        gridTemplateColumns: `repeat(auto-fill, ${size}px)`,
        flex,
        overflow: scrollable ? 'auto' : undefined,
      }}
    >
      {data.map((item, idx) => (
        <React.Fragment key={idx}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  ),

  Page: ({ children }) => <div>{children}</div>,
  Tile: ({ size, margin, children }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin,
        width: size,
        minWidth: size,
        maxWidth: size,
        height: size,
        minHeight: size,
        maxHeight: size,
        overflow: 'visible',
      }}
    >
      {children}
    </div>
  ),
  Collapsible: ({ show, children }) => <>{show ? children : null}</>,

  // list
  List: ({ items, header, footer }) => (
    <List
      // grid={{
      //   gutter: 16,
      //   column: 8,
      // }}
      // itemLayout='vertical'
      size='small'
      dataSource={items}
      renderItem={({ title, image, subtitle, content, actions, contextMenuHeader }: ListItem) => (
        <Dropdown
          trigger={['contextMenu']}
          overlay={
            actions && (
              <Menu
                onClick={item => {
                  const action = actions[+item.key]
                  if (action.onClick) {
                    action.onClick()
                  }
                }}
              >
                <Menu.ItemGroup title={contextMenuHeader} />
                {actions.map((item, i) =>
                  item.divider ? (
                    <Menu.Divider key={i} />
                  ) : (
                    <Menu.Item disabled={!item.onClick || item.disabled} key={i}>
                      <Icon type={mapIconName(item.icon)} />
                      {item.text}
                    </Menu.Item>
                  )
                )}
              </Menu>
            )
          }
        >
          <List.Item>
            <List.Item.Meta
              title={title}
              avatar={image && <ImageSourceIcon src={image} />}
              description={subtitle}
              // description={
              //   <>
              //     {image && <ImageSourceIcon src={image} />}
              //     {subtitle}
              //   </>
              // }
            />
            {content}
          </List.Item>
        </Dropdown>
      )}
      header={header}
      footer={footer}
    />
  ),

  // controls
  Spinner: Spin,
  Link: ({ onClick, children }) => <a onClick={onClick}>{children}</a>,
  Text: ({ flex, header, muted, children, onClick }) => {
    const Component: React.ComponentType<any> = header ? Title : Text
    return (
      <Component style={{ flex }} type={muted ? 'secondary' : undefined} onClick={onClick}>
        {children}
      </Component>
    )
  },
  Button: ({ danger, minimal, fill, onPress, disabled, children }) => (
    <Button
      onClick={onPress}
      disabled={disabled}
      block={fill}
      type={danger ? 'danger' : undefined}
      ghost={minimal}
      style={{ height: fill ? '100%' : undefined }}
    >
      {children}
    </Button>
  ),
  PopoverButton: ({ icon, disabled, content, minimal, loading, children }) => (
    <Dropdown
      overlay={
        <Menu
          onClick={item => {
            const c = content[+item.key]
            if (c.onClick) {
              c.onClick()
            }
          }}
        >
          {content.map((item, i) =>
            item.divider ? (
              <Menu.Divider key={i} />
            ) : (
              <Menu.Item disabled={!item.onClick} key={i}>
                <Icon type={mapIconName(item.icon)} />
                {item.text}
              </Menu.Item>
            )
          )}
        </Menu>
      }
      disabled={disabled}
      trigger={['click']}
    >
      <Button loading={loading} size='small' style={{ border: 0 }}>
        {loading ? null : React.isValidElement(icon) ? icon : children}
      </Button>
    </Dropdown>
  ),
  DeleteButton: ({ onPress, disabled, children }) => (
    <Button type='danger' block ghost onClick={onPress} disabled={disabled}>
      {children}
    </Button>
  ),
  Image,

  // form
  Form,
  CheckboxField,
  CurrencyField,
  DateField,
  Divider,
  SelectField,
  TextField,

  Tabs: Tabs as any,
  Tab: Tabs.TabPane as any,
}

const buildNavMenu = (item: NavMenuItem) =>
  item.divider ? (
    <Menu.Divider key={item.key} />
  ) : item.subitems ? (
    <Menu.SubMenu
      key={item.key}
      title={
        <span>
          {item.image && <Icon component={() => <ImageSourceIcon src={item.image} />} />}
          <span>{item.title}</span>
        </span>
      }
    >
      {item.subitems.map(buildNavMenu)}
    </Menu.SubMenu>
  ) : (
    <Menu.Item key={item.key} onClick={item.onClick} title={item.title}>
      <span>
        {item.image && <Icon component={() => <ImageSourceIcon src={item.image} />} />}
        <span>{item.title}</span>
        <br />
        <span>{item.title}</span>
      </span>
    </Menu.Item>
  )

const getNavMenuOpenKeys = (item: NavMenuItem): string[] => [
  ...(item.subitems ? [item.key] : []),
  ...(item.subitems ? item.subitems.flatMap(getNavMenuOpenKeys) : []),
]

const getNavMenuSelectedKeys = (item: NavMenuItem): string[] => [
  ...(item.active ? [item.key] : []),
  ...(item.subitems ? item.subitems.flatMap(getNavMenuSelectedKeys) : []),
]

export const mapIconName = (icon?: IconName): string | undefined => {
  // https://beta.ant.design/components/icon/
  switch (icon) {
    case 'url':
      return 'global'

    case 'image':
      return 'picture'

    case 'library':
      return 'folder-open'

    case 'add':
      return 'file-add'

    case 'refresh':
      return 'reload'

    case 'trash':
      return 'delete'

    case 'edit':
    case 'sync':
    default:
      return icon
  }
}

const ImageSourceIcon: React.FC<{ src: ImageSource | undefined }> = ({ src }) => (
  <Icon
    component={
      src
        ? () => <Avatar size='small' shape='square' style={{ borderRadius: 0 }} src={src.uri} />
        : undefined
    }
  />
)