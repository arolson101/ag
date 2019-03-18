import { ImageSource } from '@ag/util'
import ApolloClient from 'apollo-client'
import debug from 'debug'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { cancelOperation, ErrorDisplay, Gql } from '../components'
import { AppContext, typedFields } from '../context'
import * as T from '../graphql-types'

const log = debug('core:PictureDialog')

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageSource) => any
  cancelToken?: string
}

interface State {
  url: string
  cancelToken: string
}

interface Values {
  url: string
}

const thumbnailSize = 100

export class PictureDialog extends React.PureComponent<Props, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'PictureDialog'

  static readonly queries = {
    getImageList: gql`
      query GetImageList($url: String!, $cancelToken: String!) {
        getImageList(url: $url, cancelToken: $cancelToken)
      }
    ` as Gql<T.GetImageList.Query, T.GetImageList.Variables>,

    getImage: gql`
      query GetImage($url: String!, $cancelToken: String!) {
        getImage(url: $url, cancelToken: $cancelToken)
      }
    ` as Gql<T.GetImage.Query, T.GetImage.Variables>,
  }

  client!: ApolloClient<any>

  constructor(props: Props) {
    super(props)

    this.state = {
      url: props.url,
      cancelToken: props.cancelToken || '',
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { url } = this.props
    if (prevProps.url !== url) {
      log('componentDidUpdate: url %s', url)
      this.setState({ url })
    }
  }

  componentDidMount() {
    log('componentDidMount')
    const { uniqueId } = this.context
    this.setState({ cancelToken: this.props.cancelToken || uniqueId() })
    // this.getImages()
  }

  componentWillUnmount() {
    log('componentWillUnmount')
    this.cancel()
  }

  cancel = async () => {
    const { cancelToken } = this.state
    if (this.client && cancelToken) {
      cancelOperation(this.client, cancelToken)
    }
  }

  render() {
    const { isOpen } = this.props
    const { url, cancelToken } = this.state
    const { intl, ui, uniqueId } = this.context
    const { Dialog, Button, Spinner, Row, Grid, Tile, Text, Image } = ui
    const { Form, TextField } = typedFields<Values>(ui)

    const initialValues: Values = {
      url,
    }
    // log('render')

    return (
      <Dialog
        isOpen={isOpen}
        title={intl.formatMessage(messages.title)}
        secondary={{
          title: intl.formatMessage(messages.cancel),
          onClick: this.close,
        }}
      >
        <Row>
          <Formik<Values>
            enableReinitialize
            initialValues={initialValues}
            onSubmit={async (values, factions) => {
              try {
                log('onSubmit %o', values)
                await this.cancel()
                this.setState({
                  url: values.url,
                  cancelToken: this.props.cancelToken || uniqueId(),
                })
              } finally {
                factions.setSubmitting(false)
              }
            }}
          >
            {formApi => (
              <Form onSubmit={formApi.handleSubmit} lastFieldSubmit>
                <TextField field='url' label={intl.formatMessage(messages.urlLabel)} noCorrect />
              </Form>
            )}
          </Formik>
        </Row>
        <Query<T.GetImageList.Query, T.GetImageList.Variables>
          query={PictureDialog.queries.getImageList}
          variables={{ url, cancelToken }}
        >
          {({ loading: listLoading, error: listError, data: listData, client }) => {
            this.client = client
            return listLoading ? (
              <Spinner />
            ) : listError ? (
              <ErrorDisplay error={listError} />
            ) : (
              <Grid
                flex={1}
                scrollable
                size={thumbnailSize}
                data={listData ? listData.getImageList : []}
                keyExtractor={(link: string) => link}
                renderItem={(link: string) => {
                  // log('renderItem %s', link)
                  return (
                    <Tile key={link} size={thumbnailSize}>
                      <Query<T.GetImage.Query, T.GetImage.Variables>
                        query={PictureDialog.queries.getImage}
                        variables={{ url: link, cancelToken }}
                      >
                        {({ loading: imageLoading, error: imageError, data: imageData }) => {
                          const image = imageData && imageData.getImage
                          return imageLoading ? (
                            <Spinner />
                          ) : imageError ? (
                            <Text>error</Text>
                          ) : !image ? (
                            <Text>no data</Text>
                          ) : (
                            <Button fill minimal onPress={e => this.selectItem(e, image)}>
                              <Image title={link} size={thumbnailSize - 30} src={image} />
                            </Button>
                          )
                        }}
                      </Query>
                    </Tile>
                  )
                }}
              />
            )
          }}
        </Query>
      </Dialog>
    )
  }

  selectItem = async (e: React.SyntheticEvent, source: ImageSource) => {
    const { onSelected } = this.props
    const { openCropper, scaleImage } = this.context
    let image = source.toImageBuf()
    // image = await openCropper(source.toImageBuf())
    // if (!image) {
    //   return
    // }

    const scale = Math.min(thumbnailSize / image.width, thumbnailSize / image.height)
    if (scale < 1.0) {
      image = await scaleImage(image, scale)
    }

    onSelected(ImageSource.fromImageBuf(image))
    this.close()
  }

  close = () => {
    // log('close')
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
  update: {
    id: 'PictureDialog.update',
    defaultMessage: 'Update',
  },
  urlLabel: {
    id: 'PictureDialog.urlLabel',
    defaultMessage: 'URL',
  },
})
