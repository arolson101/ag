import { ComponentType } from 'react'

export interface UiContext {
  Page: ComponentType<{}>
  Text: ComponentType<{ children: string }>
}
