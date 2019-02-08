import Path from 'path'
import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext, ImageUri } from '../context'
import { getImageList, getImages } from '../online'

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageUri[]) => any
}

type State = Record<string, ImageUri[]> & {
  url: string
  links?: string[]
  selection?: string
}

const thumbnailSize = 100

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
      this.setState({ url, links: [] }, this.getImages)
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
      ui: { Dialog, DialogBody, DialogFooter, Spinner, Row, Grid, Tile, Image, Text },
    } = this.context
    const { links, selection } = this.state

    return (
      <Dialog isOpen={isOpen} title={intl.formatMessage(messages.title)}>
        <DialogBody>
          <Row>
            <Text header>{url}</Text>
          </Row>
          {!links ? (
            <Spinner />
          ) : (
            <Grid size={thumbnailSize} gap={5}>
              {links.map(link => (
                <Tile
                  key={link}
                  size={thumbnailSize}
                  selected={link === selection}
                  onClick={() => this.setState({ selection: link })}
                >
                  {!this.state[link] ? (
                    <Spinner />
                  ) : (
                    <Image size={thumbnailSize} source={this.state[link]} />
                  )}
                </Tile>
              ))}
            </Grid>
          )}
        </DialogBody>
        <DialogFooter
          primary={{
            title: intl.formatMessage(messages.ok),
            onClick: this.select,
            disabled: !selection,
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
    const { selection } = this.state
    const uri = this.state[selection!]
    onSelected(uri)
    this.close()
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
