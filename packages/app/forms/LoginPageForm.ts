export namespace LoginPageForm {
  export interface Values {
    name: string
    dbId: string
    password: string
    passwordConfirm?: string
  }

  export const initalValues: Values = {
    name: 'appdb',
    dbId: '',
    password: '',
    passwordConfirm: '',
  }
}
