import { AlertParams, IconName, ListItem, LoadingOverlayProps, UiContext } from '@ag/core'
import {
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  Icon,
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
  alert: ({ title, body, danger, onConfirm, confirmText, onCancel, cancelText }) => {
    Modal.confirm({
      title,
      content: body,
      onOk: onConfirm,
      onCancel,
      okText: confirmText,
      okType: danger ? 'danger' : 'primary',
      cancelText,
      type: '',
    })
  },

  // dialog
  Dialog: ({ isOpen, title, onClose, primary, secondary, children }) => (
    <Modal
      title={title}
      visible={isOpen}
      onCancel={onClose}
      maskClosable={false}
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
        <Button
          key='primary' //
          onClick={primary.onClick}
          type='primary'
          disabled={primary.disabled}
        >
          {primary.title}
        </Button>,
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

  // layout
  Card: ({ children }) => <Card>{children}</Card>,
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
      // itemLayout='vertical'
      dataSource={items}
      renderItem={({ title, image, subtitle, actions, contextMenuHeader }: ListItem) => (
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
                    <Menu.Item disabled={!item.onClick} key={i}>
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
              avatar={image && <Avatar shape='square' src={image.uri} />}
              description={subtitle}
            />
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
        {React.isValidElement(icon) ? icon : children}
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
