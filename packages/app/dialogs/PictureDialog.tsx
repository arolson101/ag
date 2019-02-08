import Path from 'path'
import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext, ImageUri } from '../context'
import { getImageList, getImages } from '../online'

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageUri) => any
}

type State = Record<string, ImageUri[]> & {
  url: string
  links?: string[]
}

export class PictureDialog extends React.PureComponent<Props, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'PictureDialog'

  controller: AbortController

  constructor(props: Props) {
    super(props)

    this.controller = new AbortController()
    this.state = {
      url: props.url,
    } as State
  }

  componentDidUpdate(prevProps: Props) {
    const { url } = this.props
    if (prevProps.url !== url) {
      this.cancel()
      this.setState({ url }, this.getImages)
    }
  }

  componentDidMount() {
    this.getImages()
  }

  cancel = () => {}

  getImages = async () => {
    const { url } = this.state
    const links = await getImageList(url, this.controller.signal, this.context)
    this.setState({ links })
    await Promise.all(
      links.map(async link => {
        const dls = await getImages(link, this.controller.signal, this.context)
        if (dls) {
          this.setState({ [link]: dls })
        } else {
          this.setState({ [link]: [] })
        }
      })
    )
  }

  render() {
    const { isOpen, url } = this.props
    const {
      intl,
      ui: { Dialog, DialogBody, DialogFooter, Spinner, Row, Column, Image, Text },
    } = this.context
    const { links } = this.state

    return (
      <Dialog isOpen={isOpen} title={intl.formatMessage(messages.title)}>
        <DialogBody>
          <Row>
            <Text header>{url}</Text>
          </Row>
          {!links ? (
            <Spinner />
          ) : (
            <Column>
              {links.map(link => (
                <Row key={link}>
                  <Text muted flex={1}>
                    {Path.basename(link)}
                  </Text>
                  {!this.state[link] ? <Spinner /> : <Image size={100} source={this.state[link]} />}
                </Row>
              ))}
            </Column>
          )}
        </DialogBody>
        <DialogFooter
          primary={{
            title: intl.formatMessage(messages.ok),
            onClick: this.select,
          }}
          secondary={{
            title: intl.formatMessage(messages.cancel),
            onClick: this.close,
          }}
        />
      </Dialog>
    )
  }

  select = () => {
    const { onSelected } = this.props
    const { dispatch } = this.context
    // onSelected()
    dispatch(actions.closeDlg('picture'))
  }

  close = () => {
    const { dispatch } = this.context
    dispatch(actions.closeDlg('picture'))
  }
}

const messages = defineMessages({
  title: {
    id: 'PictureDialog.title',
    defaultMessage: 'Choose Picture',
  },
  ok: {
    id: 'PictureDialog.ok',
    defaultMessage: 'Ok',
  },
  cancel: {
    id: 'PictureDialog.cancel',
    defaultMessage: 'Cancel',
  },
})
