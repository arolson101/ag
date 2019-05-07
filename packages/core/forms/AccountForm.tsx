import { Account } from '@ag/db'
import { Gql, MutationFn, pick, useApolloClient, useMutation, useQuery } from '@ag/util'
import debug from 'debug'
import { FormikErrors, FormikProvider, useField, useFormik, useFormikContext } from 'formik'
import gql from 'graphql-tag'
import React, { useCallback, useContext, useImperativeHandle, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { CoreContext, typedFields, useIntl, useUi } from '../context'
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

const FormComponent = Object.assign(
  React.memo<ComponentProps>(props => {
    const intl = useIntl()
    const { Text } = useUi()
    const { Form, SelectField, TextField } = typedFields<FormValues>(useUi())
    const { data, loading } = props

    const account = loading ? undefined : data && data.appDb && data.appDb.account
    const bank = loading ? undefined : data && data.appDb && data.appDb.bank

    const formik = useFormikContext<FormValues>()
    const [type] = useField('type')
    const [color] = useField('color')

    if (!loading && (!data || !data.appDb)) {
      throw new Error('db not open')
    }

    return (
      <Form onSubmit={formik.handleSubmit}>
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
          onValueChange={value => {
            formik.setFieldValue('color', Account.generateColor(value as Account.Type))
          }}
        />
        <TextField
          field='color'
          label={intl.formatMessage(messages.color)}
          placeholder={intl.formatMessage(messages.colorPlaceholder)}
          color={color.value}
        />
        {(type.value === Account.Type.CHECKING || type.value === Account.Type.SAVINGS) && (
          <TextField
            field='routing'
            label={intl.formatMessage(messages.routing)}
            placeholder={intl.formatMessage(messages.routingPlaceholder)}
          />
        )}
        {type.value === Account.Type.CREDITCARD && (
          <TextField
            field='key'
            label={intl.formatMessage(messages.key)}
            placeholder={intl.formatMessage(messages.keyPlaceholder)}
          />
        )}
      </Form>
    )
  }),
  {
    displayName: 'AccountForm.FormComponent',
  }
)

const Component = Object.assign(
  React.forwardRef<AccountForm, ComponentProps>((props, ref) => {
    // log('AccountForm.Component render %o', props)
    const intl = useIntl()
    const { showToast } = useUi()
    const { data, saveAccount, loading, accountId, bankId, onClosed } = props

    const account = loading ? undefined : data && data.appDb && data.appDb.account
    const initialValues: FormValues = {
      ...(account
        ? pick(account, Object.keys(Account.defaultValues()) as Array<keyof Account.Props>)
        : Account.defaultValues()),
    }

    const formik = useFormik<FormValues>({
      validateOnBlur: false,
      // enableReinitialize: true,
      initialValues,
      validate: useCallback(
        (values: FormValues) => {
          const errors: FormikErrors<FormValues> = {}
          if (!values.name || !values.name.trim()) {
            errors.name = intl.formatMessage(messages.valueEmpty)
          }
          return errors
        },
        [intl]
      ),
      onSubmit: useCallback(
        async ({ ...input }, factions) => {
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
        },
        [bankId, accountId, saveAccount, showToast, onClosed]
      ),
    })

    useImperativeHandle(ref, () => ({
      save: () => {
        formik.submitForm()
      },
    }))

    if (!loading && (!data || !data.appDb)) {
      throw new Error('db not open')
    }

    return (
      <FormikProvider value={formik as any}>
        <FormComponent {...props} />
      </FormikProvider>
    )
  }),
  {
    displayName: 'AccountForm.Component',
  }
)

export const AccountForm = Object.assign(
  React.forwardRef<AccountForm, Props>((props, ref) => {
    // log('AccountForm render %o', props)
    const { accountId, onClosed, bankId } = props

    const component = useRef<AccountForm>(null)
    const { data, loading, error } = useQuery(queries.AccountForm, {
      variables: { accountId, bankId },
    })
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

    return (
      <>
        <ErrorDisplay error={error} />
        <Component ref={component} {...{ ...props, saveAccount, data, loading }} />
      </>
    )
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
