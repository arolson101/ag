import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext, ImageUri } from '../context'
import { getImageList } from '../online'

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageUri) => any
}

interface State {
  url: string
  loading: boolean
  imageList: string[]
  images: ImageUri[]
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
      loading: false,
      imageList: [],
      images: [],
    }
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
    const imageList = await getImageList(url, this.controller.signal, this.context)
    this.setState({ imageList })
  }

  render() {
    const { isOpen, url } = this.props
    const {
      intl,
      ui: { Dialog, DialogBody, DialogFooter, Spinner, Row, Column, Text },
    } = this.context
    const { loading, imageList } = this.state

    return (
      <Dialog isOpen={isOpen} title={intl.formatMessage(messages.title)}>
        <DialogBody>
          {loading && <Spinner />}
          <Row>
            <Text header>{url}</Text>
          </Row>
          <Column>
            {imageList.map(imageName => (
              <Text>{imageName}</Text>
            ))}
          </Column>
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
