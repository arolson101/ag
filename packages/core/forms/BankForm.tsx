import { Bank } from '@ag/db'
import { pick, useSubmitRef } from '@ag/util'
import debug from 'debug'
import React, { useCallback, useImperativeHandle, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { useFields } from '../components'
import { Errors, tabConfig, useAction, useIntl, useSelector, useUi } from '../context'
import { filist, formatAddress } from '../data'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

const log = debug('core:BankForm')

type FormValues = typeof Bank.defaultValues & {
  fi: string
}

interface Props {
  bankId?: string
  onClosed: () => any
}

export interface BankForm {
  save: () => any
}

export const BankForm = Object.assign(
  React.forwardRef<BankForm, Props>(function _BankForm({ bankId, onClosed }, ref) {
    const intl = useIntl()
    const { Tabs, Tab, Text } = useUi()
    const { Form, CheckboxField, Divider, SelectField, TextField, UrlField } = useFields<
      FormValues
    >()
    const saveBank = useAction(thunks.saveBank)
    const submitFormRef = useSubmitRef()

    const bank = useSelector(selectors.getBank)(bankId)
    const defaultFi = bank ? filist.findIndex(fi => fi.name === bank.name) : 0
    const initialValues = useMemo<FormValues>(
      () => ({
        fi: defaultFi.toString(),
        ...Bank.defaultValues,
        ...(bank ? pick(Bank.keys, bank) : {}),
      }),
      [bank]
    )

    const validate = useCallback(
      values => {
        const errors: Errors<FormValues> = {}
        if (!values.name.trim()) {
          errors.name = intl.formatMessage(messages.valueEmpty)
        }
        return errors
      },
      [intl]
    )

    const submit = useCallback(
      async ({ fi, ...input }) => {
        try {
          // log('onSubmit %o', { input, bankId })
          await saveBank({ input, bankId })
          onClosed()
        } catch (err) {
          log('caught %o', err)
        }
      },
      [saveBank, onClosed]
    )

    useImperativeHandle(ref, () => ({
      save: () => {
        submitFormRef.current()
      },
    }))

    // log('initial values: %o', initialValues)
    return (
      <Form
        initialValues={initialValues}
        validate={validate}
        submit={submit}
        submitRef={submitFormRef}
      >
        {({ change, values }) => {
          const { online } = values
          return (
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
                        change('name', name)
                        change('fi', valueStr)
                        change('web', web)
                        change('iconId', '')
                        change('address', formatAddress(fi) || '')
                        change('fid', fi.fid || '')
                        change('org', fi.org || '')
                        change('ofx', fi.ofx || '')
                        // if (favicoField.current) {
                        //   favicoField.current.onValueChanged(web)
                        // }
                      }}
                      searchable
                    />
                    <Divider />
                  </>
                )}
                <TextField
                  field='name'
                  label={intl.formatMessage(messages.name)}
                  placeholder={intl.formatMessage(messages.namePlaceholder)}
                />
                <TextField
                  field='address' //
                  label={intl.formatMessage(messages.address)}
                  rows={4}
                />
                <UrlField
                  field='web'
                  nameField='name'
                  favicoField='iconId'
                  favicoWidth={Bank.iconSize}
                  favicoHeight={Bank.iconSize}
                  label={intl.formatMessage(messages.web)}
                  // ref={favicoField}
                />
                <TextField
                  field='notes' //
                  label={intl.formatMessage(messages.notes)}
                  rows={4}
                />
              </Tab>
              <Tab {...tabConfig('online', intl.formatMessage(messages.tabOnline))}>
                <CheckboxField
                  field='online' //
                  label={intl.formatMessage(messages.online)}
                />
                <TextField
                  field='username'
                  noCorrect
                  label={intl.formatMessage(messages.username)}
                  placeholder={intl.formatMessage(messages.usernamePlaceholder)}
                  disabled={!online}
                />
                <TextField
                  secure
                  field='password'
                  label={intl.formatMessage(messages.password)}
                  placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                  disabled={!online}
                />
                <Divider />
                <TextField
                  noCorrect
                  field='fid'
                  label={intl.formatMessage(messages.fid)}
                  placeholder={intl.formatMessage(messages.fidPlaceholder)}
                  disabled={!online}
                />
                <TextField
                  noCorrect
                  field='org'
                  label={intl.formatMessage(messages.org)}
                  placeholder={intl.formatMessage(messages.orgPlaceholder)}
                  disabled={!online}
                />
                <TextField
                  noCorrect
                  field='ofx'
                  label={intl.formatMessage(messages.ofx)}
                  placeholder={intl.formatMessage(messages.ofxPlaceholder)}
                  disabled={!online}
                />
              </Tab>
            </Tabs>
          )
        }}
      </Form>
    )
  }),
  {
    id: 'BankForm',
    displayName: 'BankForm',
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
