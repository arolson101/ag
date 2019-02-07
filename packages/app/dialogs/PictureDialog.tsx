import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext, ImageUri } from '../context'

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageUri) => any
}

interface State {
  url: string
  loading: boolean
  images: ImageUri[]
}

export class PictureDialog extends React.PureComponent<Props, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'PictureDialog'

  constructor(props: Props) {
    super(props)

    this.state = {
      url: props.url,
      loading: false,
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
  }

  render() {
    const { isOpen } = this.props
    const {
      intl,
      ui: { Dialog, DialogBody, DialogFooter, Spinner },
    } = this.context
    const { loading, images } = this.state

    return (
      <Dialog isOpen={isOpen} title={intl.formatMessage(messages.title)}>
        <DialogBody>{loading && <Spinner />}</DialogBody>
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
