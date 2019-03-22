import { Account } from '@ag/db'
import { Gql, MutationFn, pick, useApolloClient, useMutation, useQuery } from '@ag/util'
import { Formik, FormikErrors } from 'formik'
import gql from 'graphql-tag'
import React, { useContext, useImperativeHandle, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { CoreContext, typedFields } from '../context'
import * as T from '../graphql-types'

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
      bank {
        name
      }
    }
  `,
}

const queries = {
  AccountForm: gql`
    query AccountForm($accountId: String, $bankId: String) {
      appDb {
        account(accountId: $accountId) {
          id
          ...accountFields_AccountForm
        }
        bank(bankId: $bankId) {
          name
        }
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

interface ComponentProps extends Props {
  loading: boolean
  data: T.AccountForm.Query | undefined
  saveAccount: MutationFn<T.SaveAccount.Mutation, T.SaveAccount.Variables>
}

const Component = Object.assign(
  React.forwardRef<AccountForm, ComponentProps>((props, ref) => {
    const { ui, intl } = useContext(CoreContext)
    const { showToast, Text } = ui
    const { Form, SelectField, TextField } = typedFields<FormValues>(ui)
    const { data, saveAccount, loading, accountId, bankId, onClosed } = props

    const formik = useRef<Formik<FormValues>>(null)

    useImperativeHandle(ref, () => ({
      save: () => {
        formik.current!.submitForm()
      },
    }))

    if (!loading && (!data || !data.appDb)) {
      throw new Error('db not open')
    }

    const account = loading ? undefined : data && data.appDb && data.appDb.account
    const bank = loading ? undefined : data && data.appDb && data.appDb.bank
    const initialValues: FormValues = {
      ...(account
        ? pick(account, Object.keys(Account.defaultValues()) as Array<keyof Account.Props>)
        : Account.defaultValues()),
    }

    return (
      <Formik<FormValues>
        ref={formik}
        validateOnBlur={false}
        enableReinitialize
        initialValues={initialValues}
        validate={values => {
          const errors: FormikErrors<FormValues> = {}
          if (!values.name || !values.name.trim()) {
            errors.name = intl.formatMessage(messages.valueEmpty)
          }
          return errors
        }}
        onSubmit={async ({ ...input }, factions) => {
          try {
            const variables = {
              bankId,
              accountId,
              input,
            }
            await saveAccount({ variables } as any)
            showToast(
              intl.formatMessage(accountId ? messages.saved : messages.created, {
                name: input.name,
              })
            )
            onClosed()
          } finally {
            factions.setSubmitting(false)
          }
        }}
      >
        {formApi => {
          return (
            <Form onSubmit={formApi.handleSubmit}>
              <Text header>{account ? account.bank.name : bank ? bank.name : '<no bank>'}</Text>
              <TextField
                field='name'
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
                onValueChange={type => {
                  formApi.setFieldValue('color', Account.generateColor(type as Account.Type))
                }}
              />
              <TextField
                field='color'
                label={intl.formatMessage(messages.color)}
                placeholder={intl.formatMessage(messages.colorPlaceholder)}
                color={formApi.values.color}
              />
              {(formApi.values.type === Account.Type.CHECKING ||
                formApi.values.type === Account.Type.SAVINGS) && (
                <TextField
                  field='routing'
                  label={intl.formatMessage(messages.routing)}
                  placeholder={intl.formatMessage(messages.routingPlaceholder)}
                />
              )}
              {formApi.values.type === Account.Type.CREDITCARD && (
                <TextField
                  field='key'
                  label={intl.formatMessage(messages.key)}
                  placeholder={intl.formatMessage(messages.keyPlaceholder)}
                />
              )}
            </Form>
          )
        }}
      </Formik>
    )
  }),
  {
    displayName: 'AccountForm.Component',
  }
)

export const AccountForm = Object.assign(
  React.forwardRef<AccountForm, Props>((props, ref) => {
    const { accountId, onClosed, bankId } = props

    const component = useRef<AccountForm>(null)
    const { data, loading } = useQuery(queries.AccountForm, { variables: { accountId, bankId } })
    const client = useApolloClient()
    const saveAccount = useMutation(mutations.SaveAccount, {
      update: () => {
        client.reFetchObservableQueries()
      },
    })

    useImperativeHandle(ref, () => ({
      save: () => {
        component.current!.save()
      },
    }))

    return <Component ref={component} {...{ ...props, saveAccount, data, loading }} />
  }),
  {
    id: 'AccountForm',
    displayName: 'AccountForm',
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
  valueEmpty: {
    id: 'BankForm.valueEmpty',
    defaultMessage: 'Cannot be empty',
  },
  createTitle: {
    id: 'AccountDialog.createTitle',
    defaultMessage: 'Add Account',
  },
  editTitle: {
    id: 'AccountDialog.editTitle',
    defaultMessage: 'Edit Account',
  },
  name: {
    id: 'AccountDialog.name',
    defaultMessage: 'Name',
  },
  namePlaceholder: {
    id: 'AccountDialog.namePlaceholder',
    defaultMessage: 'My Checking',
  },
  number: {
    id: 'AccountDialog.number',
    defaultMessage: 'Number',
  },
  numberPlaceholder: {
    id: 'AccountDialog.numberPlaceholder',
    defaultMessage: '54321',
  },
  type: {
    id: 'AccountDialog.type',
    defaultMessage: 'Type',
  },
  uniqueName: {
    id: 'AccountDialog.uniqueName',
    defaultMessage: 'This account name is already used',
  },
  uniqueNumber: {
    id: 'AccountDialog.uniqueNumber',
    defaultMessage: 'This account number is already used',
  },
  color: {
    id: 'AccountDialog.color',
    defaultMessage: 'Color',
  },
  colorPlaceholder: {
    id: 'AccountDialog.colorPlaceholder',
    defaultMessage: 'red',
  },
  routing: {
    id: 'AccountDialog.routing',
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
    id: 'AccountDialog.routingPlaceholder',
    defaultMessage: '0123456',
  },
  key: {
    id: 'AccountDialog.key',
    defaultMessage: 'Account Key',
  },
  keyPlaceholder: {
    id: 'AccountDialog.keyPlaceholder',
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
