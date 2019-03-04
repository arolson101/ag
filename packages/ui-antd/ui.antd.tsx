import { AlertProps, IconName, TabProps, TabsProps, UiContext } from '@ag/core'
import { Button, Card, Divider, Menu, message, Modal, Popover, Spin, Tabs } from 'antd'
import 'antd/dist/antd.css'
import { ModalFuncProps } from 'antd/lib/modal'
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

export const ui: UiContext = {
  // special ui
  showToast: (text, danger) => (danger ? message.success(text) : message.error(text)),

  // dialog
  Alert: class Alert extends React.PureComponent<AlertProps> {
    componentDidMount() {
      this.maybeShow()
    }
    componentDidUpdate() {
      this.maybeShow()
    }
    maybeShow() {
      const { title, body, danger, onConfirm, confirmText, onCancel, cancelText, show } = this.props
      if (show) {
        const props: ModalFuncProps = {
          title,
          content: body && body.join('\n'),
          onOk: onConfirm,
          onCancel,
          okText: confirmText,
          cancelText,
          type: '',
        }
        if (danger) {
          Modal.warning(props)
        } else {
          Modal.confirm(props)
        }
      }
    }
    render() {
      return null
    }
  },

  LoadingOverlay: ({ show }) =>
    // <Overlay isOpen={show} canEscapeKeyClose={false} canOutsideClickClose={false}>
    show ? <Spin /> : null,
    // </Overlay>

  Dialog: ({ isOpen, title, onClose, primary, secondary, children }) => (
    <Modal
      title={title}
      visible={isOpen}
      onCancel={onClose}
      footer={[
        secondary ? (
          <Button
            onClick={secondary.onClick}
            type={secondary.isDanger ? 'danger' : undefined}
            disabled={secondary.disabled}
          >
            {secondary.title}
          </Button>
        ) : null,
        <Button onClick={primary.onClick} type='primary' disabled={primary.disabled}>
          {primary.title}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  ),

  DialogBody: ({ children }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 5,
        maxHeight: 600,
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  ),

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
  List: ({ children }) => <Card>{children}</Card>,
  ListItem: ({ title, image, subtitle, children, actions }) => (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {title && (
          <Title style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            {image && (
              <div
                style={{
                  background: `center no-repeat url(${image.uri})`,
                  backgroundSize: 'contain',
                  width: 24,
                  height: 24,
                  margin: 5,
                }}
              />
            )}
            {title}
          </Title>
        )}
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
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
  PopoverButton: ({ icon, disabled, content, minimal, loading, children }) => null,
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

  Tabs: ({ children }) => <Tabs>{children}</Tabs>,
  Tab: ({ id, title, heading, panel, children }) => (
    <Tabs.TabPane tab={title} key={id}>
      {panel}
    </Tabs.TabPane>
  ),
}

export const mapIconName = (icon?: IconName): string | undefined => {
  switch (icon) {
    case 'url':
      return 'globe-network'

    case 'image':
      return 'media'

    case 'library':
      return 'folder-open'

    case 'refresh':
    case 'trash':
      return icon
  }
}
