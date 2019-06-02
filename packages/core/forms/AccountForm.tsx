import { Account } from '@ag/db'
import {
  Gql,
  MutationFn,
  pick,
  useApolloClient,
  useField,
  useFieldValue,
  useForm,
  useMutation,
  useQuery,
  useSubmitRef,
} from '@ag/util'
import debug from 'debug'
import gql from 'graphql-tag'
import React, { useCallback, useImperativeHandle, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { ErrorDisplay, TextFieldWithIcon } from '../components'
import { Errors, typedFields, useIntl, useUi } from '../context'
import * as T from '../graphql-types'

const log = debug('AccountForm')

interface Props {
  accountId?: string
  bankId?: string
  onClosed: () => any
}

type FormValues = ReturnType<typeof Account.defaultValues>

const fragments = {
  accountFields: gql`
    fragment accountFields_AccountForm on Account {
      bankId
      name
      type
      color
      number
      visible
      routing
      key
      sortOrder
      icon
      bank {
        name
        icon
        web
      }
    }
  `,
}

const queries = {
  AccountForm: gql`
    query AccountForm($accountId: String, $bankId: String) {
      account(accountId: $accountId) {
        id
        ...accountFields_AccountForm
      }
      bank(bankId: $bankId) {
        name
        icon
        web
      }
    }
    ${fragments.accountFields}
  ` as Gql<T.AccountForm.Query, T.AccountForm.Variables>,
}

const mutations = {
  SaveAccount: gql`
    mutation SaveAccount($input: AccountInput!, $accountId: String, $bankId: String) {
      saveAccount(input: $input, accountId: $accountId, bankId: $bankId) {
        id
        ...accountFields_AccountForm
      }
    }
    ${fragments.accountFields}
  ` as Gql<T.SaveAccount.Mutation, T.SaveAccount.Variables>,
}

export interface AccountForm {
  save: () => any
}

const iconSize = 100

export const AccountForm = Object.assign(
  React.forwardRef<AccountForm, Props>(function _AccountFormComponent(props, ref) {
    const intl = useIntl()
    const submitFormRef = useSubmitRef()
    const { Text, Image, Row, showToast } = useUi()
    const client = useApolloClient()
    const { Form, SelectField, TextField } = typedFields<FormValues>(useUi())
    const { accountId, bankId, onClosed } = props

    const { data, loading, error } = useQuery(queries.AccountForm, {
      variables: { accountId, bankId },
    })
    const saveAccount = useMutation(mutations.SaveAccount)

    const account = loading ? undefined : data && data.account
    const bank = loading ? undefined : data && data.bank
    const bankUrl = account ? account.bank.web : bank ? bank.web : ''
    const bankIcon = account ? account.bank.icon : bank ? bank.icon : ''

    if (!loading && !data) {
      throw new Error('no data')
    }

    const initialValues: FormValues = {
      ...(account
        ? pick(account, Object.keys(Account.defaultValues()) as Array<keyof Account.Props>)
        : Account.defaultValues()),
    }

    const validate = useCallback(
      (values: FormValues) => {
        const errors: Errors<FormValues> = {}
        if (!values.name || !values.name.trim()) {
          errors.name = intl.formatMessage(messages.valueEmpty)
        }
        return errors
      },
      [intl]
    )

    const submit = useCallback(
      async ({ ...input }) => {
        try {
          const variables = {
            bankId,
            accountId,
            input,
          }
          await saveAccount({ variables })
          client.reFetchObservableQueries()
          showToast(
            intl.formatMessage(accountId ? messages.saved : messages.created, {
              name: input.name,
            })
          )
          onClosed()
        } catch (error) {
          log('error %o', error)
        }
      },
      [bankId, accountId, saveAccount, showToast, onClosed]
    )

    useImperativeHandle(ref, () => ({
      save: () => {
        submitFormRef.current()
      },
    }))

    return (
      <>
        <ErrorDisplay error={error} />

        <Form
          initialValues={initialValues} //
          validate={validate}
          submit={submit}
          submitRef={submitFormRef}
        >
          {({ change, values: { type, color } }) => {
            return (
              <>
                <Row>
                  <Text header icon={bankIcon}>
                    {account ? account.bank.name : bank ? bank.name : '<no bank>'}
                  </Text>
                </Row>
                <TextFieldWithIcon<FormValues>
                  field='name'
                  favicoField='icon'
                  defaultUrl={bankUrl}
                  defaultIcon={bankIcon}
                  favicoWidth={iconSize}
                  favicoHeight={iconSize}
                  label={intl.formatMessage(messages.name)}
                  placeholder={intl.formatMessage(messages.namePlaceholder)}
                  autoFocus={!account}
                />
                <TextField
                  field='number'
                  label={intl.formatMessage(messages.number)}
                  placeholder={intl.formatMessage(messages.numberPlaceholder)}
                />
                <SelectField
                  field='type'
                  items={Object.keys(Account.Type).map(acct => ({
                    value: acct.toString(),
                    label: intl.formatMessage((Account.messages as Record<string, any>)[acct]),
                  }))}
                  label={intl.formatMessage(messages.type)}
                  onValueChange={value => {
                    change('color', Account.generateColor(value as Account.Type))
                  }}
                />
                <TextField
                  field='color'
                  label={intl.formatMessage(messages.color)}
                  placeholder={intl.formatMessage(messages.colorPlaceholder)}
                  color={color}
                />
                {(type === Account.Type.CHECKING || type === Account.Type.SAVINGS) && (
                  <TextField
                    field='routing'
                    label={intl.formatMessage(messages.routing)}
                    placeholder={intl.formatMessage(messages.routingPlaceholder)}
                  />
                )}
                {type === Account.Type.CREDITCARD && (
                  <TextField
                    field='key'
                    label={intl.formatMessage(messages.key)}
                    placeholder={intl.formatMessage(messages.keyPlaceholder)}
                  />
                )}
              </>
            )
          }}
        </Form>
      </>
    )
  }),
  {
    id: 'AccountForm',
    displayName: 'AccountForm',
    queries,
    mutations,
    fragments,
  }
)

const messages = defineMessages({
  save: {
    id: 'AccountForm.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'AccountForm.create',
    defaultMessage: 'Add',
  },
  valueEmpty: {
    id: 'AccountForm.valueEmpty',
    defaultMessage: 'Cannot be empty',
  },
  createTitle: {
    id: 'AccountForm.createTitle',
    defaultMessage: 'Add Account',
  },
  editTitle: {
    id: 'AccountForm.editTitle',
    defaultMessage: 'Edit Account',
  },
  name: {
    id: 'AccountForm.name',
    defaultMessage: 'Name',
  },
  namePlaceholder: {
    id: 'AccountForm.namePlaceholder',
    defaultMessage: 'My Checking',
  },
  number: {
    id: 'AccountForm.number',
    defaultMessage: 'Number',
  },
  numberPlaceholder: {
    id: 'AccountForm.numberPlaceholder',
    defaultMessage: '54321',
  },
  type: {
    id: 'AccountForm.type',
    defaultMessage: 'Type',
  },
  uniqueName: {
    id: 'AccountForm.uniqueName',
    defaultMessage: 'This account name is already used',
  },
  uniqueNumber: {
    id: 'AccountForm.uniqueNumber',
    defaultMessage: 'This account number is already used',
  },
  color: {
    id: 'AccountForm.color',
    defaultMessage: 'Color',
  },
  colorPlaceholder: {
    id: 'AccountForm.colorPlaceholder',
    defaultMessage: 'red',
  },
  routing: {
    id: 'AccountForm.routing',
    defaultMessage: 'Routing Number',
    description: `Bank identifier, A-9
      Use of this field by country:
      COUNTRY     Interpretation
      BEL         Bank code
      CAN         Routing and transit number
      CHE         Clearing number
      DEU         Bankleitzahl
      ESP         Entidad
      FRA         Banque
      GBR         Sort code
      ITA         ABI
      NLD         Not used (field contents ignored)
      USA         Routing and transit number`,
  },
  routingPlaceholder: {
    id: 'AccountForm.routingPlaceholder',
    defaultMessage: '0123456',
  },
  key: {
    id: 'AccountForm.key',
    defaultMessage: 'Account Key',
  },
  keyPlaceholder: {
    id: 'AccountForm.keyPlaceholder',
    defaultMessage: '(for international accounts)',
  },
  saved: {
    id: 'AccountForm.saved',
    defaultMessage: "Account '{name}' saved",
  },
  created: {
    id: 'AccountForm.created',
    defaultMessage: "Account '{name}' added",
  },
})
