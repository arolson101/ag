import debug from 'debug'
import { GraphQLError } from 'graphql'
import gql from 'graphql-tag'
import { defineMessages } from 'react-intl'
import { from } from 'rxjs'
import { filter, ignoreElements, map, mergeMap, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { LoginPage } from '../pages'
import { AppEpic } from './index'
import { createRouteEpic } from './navEpics'

const log = debug('app:LoginPage')

const pushAlertForGraphQlErrors = (action: string, errors: ReadonlyArray<GraphQLError>) =>
  actions.pushAlert({
    title: { id: messages.graphQlError, values: { action } },
    body: errors.map(error => ({ id: messages.error, values: error })),
    confirmText: messages.ok,
    show: true,
  })

const loginPageSubmit: AppEpic = (action$, state$, { runQuery }) =>
  action$.pipe(
    filter(isActionOf(actions.loginPage.submitForm))
    // mergeMap(({ payload: { values, factions } }) => {
    //   const create = !values.dbId
    //   log(`loginPageSubmit %o`, values)
    //   if (create) {
    //     const query = gql`
    //       mutation CreateDb($name: String!, $password: String!) {
    //         createDb(name: $name, password: $password)
    //       }
    //     `
    //     log(`running query CreateDb variables %o`, values)
    //     return from(runQuery<CreateDbVariables, CreateDbMutation>(query, values)).pipe(
    //       map(({ data, errors }) => {
    //         factions.setSubmitting(false)
    //         if (errors) {
    //           log(`failure: %o`, errors)
    //           return pushAlertForGraphQlErrors('CreateDb', errors)
    //         } else {
    //           log(`success with data %o`, data)
    //           return actions.pushAlert({
    //             title: { id: messages.success },
    //             confirmText: messages.ok,
    //             show: true,
    //           })
    //         }
    //       })
    //     )
    //   } else {
    //     const query = gql`
    //       mutation OpenDb($dbId: String!, $password: String!) {
    //         openDb(dbId: $dbId, password: $password)
    //       }
    //     `
    //     log(`running query OpenDb variables %o`, values)
    //     return from(runQuery<OpenDbVariables, OpenDbMutation>(query, values)).pipe(
    //       map(({ data, errors }) => {
    //         factions.setSubmitting(false)
    //         if (errors) {
    //           log(`failure: %o`, errors)
    //           return pushAlertForGraphQlErrors('OpenDb', errors)
    //         } else {
    //           log(`success with data %o`, data)
    //           return actions.pushAlert({
    //             title: { id: messages.success },
    //             confirmText: messages.ok,
    //             show: true,
    //           })
    //         }
    //       })
    //     )
    //   }
    // })
  )

const deleteDbEpic: AppEpic = (action$, state$, { runQuery }) =>
  action$.pipe(
    filter(isActionOf(actions.loginPage.deleteDb))
    // mergeMap(({ payload: variables }) => {
    //   const query = gql`
    //     mutation DeleteDb($dbId: String!) {
    //       deleteDb(dbId: $dbId)
    //     }
    //   `
    //   log(`running query DeleteDb variables %o`, query, variables)
    //   return from(runQuery<DeleteDbVariables, DeleteDbMutation>(query, variables)).pipe(
    //     map(({ data, errors }) => {
    //       if (errors) {
    //         log(`failure: %o`, errors)
    //         return pushAlertForGraphQlErrors('DeleteDb', errors)
    //       } else {
    //         log(`success with data %o`, data)
    //         return actions.pushAlert({
    //           title: { id: messages.success },
    //           confirmText: messages.ok,
    //           show: true,
    //         })
    //       }
    //     })
    //   )
    // })
  )

export const loginPageEpics = [
  // createRouteEpic(LoginPage.url, LoginPage.query),
  loginPageSubmit,
  deleteDbEpic,
]

const messages = defineMessages({
  ok: {
    id: 'navEpics.ok',
    defaultMessage: 'Ok',
  },
  error: {
    id: 'navEpics.error',
    defaultMessage: '{message}',
  },
  graphQlError: {
    id: 'navEpics.graphQlError',
    defaultMessage: "Error running '{action}'",
  },
  success: {
    id: 'navEpics.success',
    defaultMessage: "Success'",
  },
})
