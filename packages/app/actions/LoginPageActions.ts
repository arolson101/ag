import { FormikActions } from 'formik'
import { createAction, createStandardAction } from 'typesafe-actions'
import { LoginPageForm } from '../forms'

export const loginPage = {
  submitForm: createAction(
    'LoginPage/submitForm',
    resolve => (values: LoginPageForm.Values, factions: FormikActions<LoginPageForm.Values>) =>
      resolve({ values, factions })
  ),
  deleteDb: createStandardAction('LoginPage/deleteDb')<{ dbId: string }>(),
}
