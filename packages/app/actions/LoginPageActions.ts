import { createStandardAction } from 'typesafe-actions'
import { LoginPageForm } from '../forms'

export const loginPage = {
  submitForm: createStandardAction('LoginPage/submitForm')<LoginPageForm.Values>(),
  deleteDb: createStandardAction('LoginPage/deleteDb')<{ dbId: string }>(),
}
