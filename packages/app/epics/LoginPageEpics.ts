import debug from 'debug'
import gql from 'graphql-tag'
import { from } from 'rxjs'
import { filter, ignoreElements, map, mergeMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import {
  CreateDbMutation,
  CreateDbVariables,
  DeleteDbMutation,
  DeleteDbVariables,
  OpenDbMutation,
  OpenDbVariables,
} from '../graphql-types'
import { EpicType } from './index'

const log = debug('app:LoginPage')

const loginPageSubmit: EpicType = (action$, state$, { runQuery }) =>
  action$.pipe(
    filter(isActionOf(actions.loginPage.submitForm)),
    mergeMap(({ payload: values }) => {
      const create = !!values.dbId
      if (create) {
        const query = gql`
          mutation CreateDb($name: String!, $password: String!) {
            createDb(name: $name, password: $password)
          }
        `
        log(`running query CreateDb variables %o`, values)
        return from(runQuery<CreateDbVariables, CreateDbMutation>(query, values)).pipe(
          map(({ data, errors }) => {
            if (errors) {
              log(`failure: %o`, errors)
            } else {
              log(`success with data %o`, data)
            }
          })
        )
      } else {
        const query = gql`
          mutation OpenDb($dbId: String!, $password: String!) {
            openDb(dbId: $dbId, password: $password)
          }
        `
        log(`running query OpenDb variables %o`, values)
        return from(runQuery<OpenDbVariables, OpenDbMutation>(query, values)).pipe(
          map(({ data, errors }) => {
            if (errors) {
              log(`failure: %o`, errors)
            } else {
              log(`success with data %o`, data)
            }
          })
        )
      }
    }),
    ignoreElements()
  )

const deleteDbEpic: EpicType = (action$, state$, { runQuery }) =>
  action$.pipe(
    filter(isActionOf(actions.loginPage.deleteDb)),
    mergeMap(({ payload: variables }) => {
      const query = gql`
        mutation DeleteDb($dbId: String!) {
          deleteDb(dbId: $dbId)
        }
      `
      log(`running query DeleteDb variables %o`, query, variables)
      return from(runQuery<DeleteDbVariables, DeleteDbMutation>(query, variables)).pipe(
        map(({ data, errors }) => {
          if (errors) {
            log(`failure: %o`, errors)
          } else {
            log(`success with data %o`, data)
          }
        })
      )
    }),
    ignoreElements()
  )

export const loginPageEpics = [
  loginPageSubmit, //
  deleteDbEpic,
]
