import { useRef } from 'react'
import {
  FieldInputProps as FieldInputProps1,
  FieldRenderProps as FieldRenderProps1,
  useField as useField1,
  useForm,
} from 'react-final-form'

export { useForm }

interface FieldInputProps<T> extends FieldInputProps1<any> {
  value: T
}

interface FieldRenderProps<T> extends FieldRenderProps1<any> {
  input: FieldInputProps<T>
}

export const useField = <T = string>(name: string) => {
  const ret = useField1(name, {}) as FieldRenderProps<T>
  return [ret.input, ret.meta] as const
}

export const useFieldValue = <T = string>(name: string): T => useField<T>(name)[0].value

export type SubmitFunction = () => any

const submitFormUnset = () => {
  throw new Error('submit form not set')
}

export const useSubmitRef = () => useRef<SubmitFunction>(submitFormUnset)
