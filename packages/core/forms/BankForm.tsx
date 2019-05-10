import { Bank } from '@ag/db'
import {
  generateAvatar,
  Gql,
  MutationFn,
  pick,
  useApolloClient,
  useMutation,
  useQuery,
} from '@ag/util'
import debug from 'debug'
import { FormikErrors, FormikProvider, useField, useFormik, useFormikContext } from 'formik'
import gql from 'graphql-tag'
import React, { useImperativeHandle, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { UrlField } from '../components/UrlField'
import { tabConfig, typedFields, useIntl, useUi } from '../context'
import { filist, formatAddress } from '../data'
import * as T from '../graphql-types'

const log = debug('core:BankForm')

type FormValues = typeof Bank.defaultValues & {
  fi: string
}

interface Props {
  bankId?: string
  onClosed: () => any
  cancelToken?: string
}

const bankAvatarSize = 100

const fragments = {
  bankFields: gql`
    fragment bankFields on Bank {
      name
      web
      address
      notes
      favicon

      online

      fid
      org
      ofx

      username
      password
    }
  `,
}

const queries = {
  BankForm: gql`
    query BankForm($bankId: String) {
      bank(bankId: $bankId) {
        ...bankFields
      }
    }
    ${fragments.bankFields}
  ` as Gql<T.BankForm.Query, T.BankForm.Variables>,
}

const mutations = {
  SaveBank: gql`
    mutation SaveBank($input: BankInput!, $bankId: String) {
      saveBank(input: $input, bankId: $bankId) {
        id
        ...bankFields
      }
    }
    ${fragments.bankFields}
  ` as Gql<T.SaveBank.Mutation, T.SaveBank.Variables>,
}

export interface BankForm {
  save: () => any
}

interface ComponentProps extends Props {
  loading: boolean
  data: T.BankForm.Query | undefined
  saveBank: MutationFn<T.SaveBank.Mutation, T.SaveBank.Variables>
}

const FormComponent = Object.assign(
  React.memo<ComponentProps>(function _FormComponent(props) {
    const intl = useIntl()
    const ui = useUi()
    const { LoadingOverlay, Tabs, Tab, Text, showToast } = ui
    const { Form, CheckboxField, Divider, SelectField, TextField } = typedFields<FormValues>(ui)
    const { data, saveBank, loading, bankId, onClosed, cancelToken } = props

    const bank = loading ? undefined : data && data.bank
    const defaultFi = bank ? filist.findIndex(fi => fi.name === bank.name) : 0
    const initialValues = {
      fi: defaultFi.toString(),
      ...(bank
        ? pick(bank, Object.keys(Bank.defaultValues) as Array<keyof Bank.Props>)
        : Bank.defaultValues),
    }

    const formik = useFormikContext<FormValues>()
    // const favicoField = useRef<UrlField<FormValues>>(null)
    const [online] = useField('online')

    if (!loading && !data) {
      throw new Error('no data')
    }

    // log('initial values: %o', initialValues)
    return (
      <>
        <LoadingOverlay show={loading} title={`BankForm loading`} />
        <Form onSubmit={formik.handleSubmit}>
          <Tabs id='BankForm' defaultActiveKey='location'>
            <Tab {...tabConfig('location', intl.formatMessage(messages.tabInfo))}>
              {!bankId && (
                <>
                  <Text>{intl.formatMessage(messages.fiHelp)}</Text>
                  <Divider />
                  <SelectField
                    field='fi'
                    items={filist.map(fi => ({
                      label: fi.name,
                      value: fi.id.toString(),
                    }))}
                    label={intl.formatMessage(messages.fi)}
                    onValueChange={valueStr => {
                      const value = +valueStr
                      const fi = filist[value]
                      const name = value ? fi.name || '' : ''
                      const web = fi.profile.siteURL || ''
                      formik.setFieldValue('name', name)
                      formik.setFieldValue('fi', valueStr)
                      formik.setFieldValue('web', web)
                      formik.setFieldValue('favicon', generateAvatar(name))
                      formik.setFieldValue('address', formatAddress(fi) || '')
                      formik.setFieldValue('fid', fi.fid || '')
                      formik.setFieldValue('org', fi.org || '')
                      formik.setFieldValue('ofx', fi.ofx || '')
                      // if (favicoField.current) {
                      //   favicoField.current.onValueChanged(web)
                      // }
                    }}
                    searchable
                    disabled={loading}
                  />
                  <Divider />
                </>
              )}
              <TextField
                field='name'
                label={intl.formatMessage(messages.name)}
                placeholder={intl.formatMessage(messages.namePlaceholder)}
                disabled={loading}
              />
              <TextField
                field='address'
                label={intl.formatMessage(messages.address)}
                rows={4}
                disabled={loading}
              />
              <UrlField
                field='web'
                nameField='name'
                favicoField='favicon'
                favicoWidth={bankAvatarSize}
                favicoHeight={bankAvatarSize}
                label={intl.formatMessage(messages.web)}
                cancelToken={cancelToken}
                // ref={favicoField}
                disabled={loading}
              />
              <TextField
                field='notes'
                label={intl.formatMessage(messages.notes)}
                rows={4}
                disabled={loading}
              />
            </Tab>
            <Tab {...tabConfig('online', intl.formatMessage(messages.tabOnline))}>
              <CheckboxField
                field='online'
                label={intl.formatMessage(messages.online)}
                disabled={loading}
              />
              <TextField
                field='username'
                noCorrect
                label={intl.formatMessage(messages.username)}
                placeholder={intl.formatMessage(messages.usernamePlaceholder)}
                disabled={loading || !online.value}
              />
              <TextField
                secure
                field='password'
                label={intl.formatMessage(messages.password)}
                placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                disabled={loading || !online.value}
              />
              <Divider />
              <TextField
                noCorrect
                field='fid'
                label={intl.formatMessage(messages.fid)}
                placeholder={intl.formatMessage(messages.fidPlaceholder)}
                disabled={loading || !online.value}
              />
              <TextField
                noCorrect
                field='org'
                label={intl.formatMessage(messages.org)}
                placeholder={intl.formatMessage(messages.orgPlaceholder)}
                disabled={loading || !online.value}
              />
              <TextField
                noCorrect
                field='ofx'
                label={intl.formatMessage(messages.ofx)}
                placeholder={intl.formatMessage(messages.ofxPlaceholder)}
                disabled={loading || !online.value}
              />
            </Tab>
          </Tabs>
        </Form>
      </>
    )
  }),
  {
    displayName: 'BankForm.Component',
  }
)

const Component = Object.assign(
  React.forwardRef<BankForm, ComponentProps>((props, ref) => {
    const intl = useIntl()
    const { showToast } = useUi()
    const { data, saveBank, loading, bankId, onClosed, cancelToken } = props

    const bank = loading ? undefined : data && data.bank
    const defaultFi = bank ? filist.findIndex(fi => fi.name === bank.name) : 0
    const initialValues = {
      fi: defaultFi.toString(),
      ...(bank
        ? pick(bank, Object.keys(Bank.defaultValues) as Array<keyof Bank.Props>)
        : Bank.defaultValues),
    }

    const formik = useFormik({
      validateOnBlur: false,
      enableReinitialize: true,
      initialValues,
      validate: values => {
        const errors: FormikErrors<FormValues> = {}
        if (!values.name.trim()) {
          errors.name = intl.formatMessage(messages.valueEmpty)
        }
        return errors
      },
      onSubmit: async ({ fi, ...input }, factions) => {
        try {
          // log('onSubmit %o', { input, bankId })
          await saveBank({ variables: { input, bankId } })
          showToast(
            intl.formatMessage(bankId ? messages.saved : messages.created, {
              name: input.name,
            })
          )
          onClosed()
        } finally {
          factions.setSubmitting(false)
        }
      },
    })

    useImperativeHandle(ref, () => ({
      save: () => {
        formik.submitForm()
      },
    }))

    if (!loading && !data) {
      throw new Error('no data')
    }

    // log('initial values: %o', initialValues)
    return (
      <FormikProvider value={formik as any}>
        <FormComponent {...props} />
      </FormikProvider>
    )
  }),
  {
    displayName: 'BankForm.Component',
  }
)

export const BankForm = Object.assign(
  React.forwardRef<BankForm, Props>((props, ref) => {
    const { bankId } = props

    const component = useRef<BankForm>(null)
    const { data, loading, error } = useQuery(queries.BankForm, { variables: { bankId } })
    const client = useApolloClient()
    const saveBank = useMutation(mutations.SaveBank, {
      update: () => {
        client.reFetchObservableQueries()
      },
    })

    useImperativeHandle(ref, () => ({
      save: () => {
        component.current!.save()
      },
    }))

    // log('initial values: %o', initialValues)
    return (
      <>
        <ErrorDisplay error={error} />
        <Component ref={component} {...{ ...props, saveBank, data, loading }} />
      </>
    )
  }),
  {
    id: 'BankForm',
    displayName: 'BankForm',
    queries,
    mutations,
    fragments,
    Component,
  }
)

const messages = defineMessages({
  save: {
    id: 'BankForm.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'BankForm.create',
    defaultMessage: 'Add',
  },
  tabInfo: {
    id: 'BankForm.tabInfo',
    defaultMessage: 'Information',
  },
  tabOnline: {
    id: 'BankForm.tabOnline',
    defaultMessage: 'Online',
  },
  tabResources: {
    id: 'BankForm.tabResources',
    defaultMessage: 'Resources',
  },
  tabAccounts: {
    id: 'BankForm.tabAccounts',
    defaultMessage: 'Accounts',
  },
  valueEmpty: {
    id: 'BankForm.valueEmpty',
    defaultMessage: 'Cannot be empty',
  },
  fi: {
    id: 'BankForm.fi',
    defaultMessage: 'Institution',
  },
  fiHelp: {
    id: 'BankForm.fiHelp',
    defaultMessage: 'Choose a financial institution from the list or fill in the details below',
  },
  fiPlaceholder: {
    id: 'BankForm.fiPlaceholder',
    defaultMessage: 'Select financial institution...',
  },
  name: {
    id: 'BankForm.name',
    defaultMessage: 'Name',
  },
  namePlaceholder: {
    id: 'BankForm.namePlaceholder',
    defaultMessage: 'Bank Name',
  },
  address: {
    id: 'BankForm.address',
    defaultMessage: 'Address',
  },
  web: {
    id: 'BankForm.web',
    defaultMessage: 'URL',
  },
  notes: {
    id: 'BankForm.notes',
    defaultMessage: 'Notes',
  },
  online: {
    id: 'BankForm.online',
    defaultMessage: 'Enabled',
  },
  fid: {
    id: 'BankForm.fid',
    defaultMessage: 'Fid',
  },
  fidPlaceholder: {
    id: 'BankForm.fidPlaceholder',
    defaultMessage: '1234',
  },
  org: {
    id: 'BankForm.org',
    defaultMessage: 'Org',
  },
  orgPlaceholder: {
    id: 'BankForm.orgPlaceholder',
    defaultMessage: 'MYBANK',
  },
  ofx: {
    id: 'BankForm.ofx',
    defaultMessage: 'OFX Server',
  },
  ofxPlaceholder: {
    id: 'BankForm.ofxPlaceholder',
    defaultMessage: 'https://ofx.mybank.com',
  },
  username: {
    id: 'BankForm.username',
    defaultMessage: 'Username',
  },
  usernamePlaceholder: {
    id: 'BankForm.usernamePlaceholder',
    defaultMessage: 'Username',
  },
  password: {
    id: 'BankForm.password',
    defaultMessage: 'Password',
  },
  passwordPlaceholder: {
    id: 'BankForm.passwordPlaceholder',
    defaultMessage: 'Required',
  },
  saved: {
    id: 'BankForm.saved',
    defaultMessage: `Bank '{name}' saved`,
  },
  created: {
    id: 'BankForm.created',
    defaultMessage: `Bank '{name}' added`,
  },
})
