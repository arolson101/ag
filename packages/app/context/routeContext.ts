import React from 'react'
import { RouteConfig } from '../routes'

export interface RouterProps {
  routes: RouteConfig
}

export type Router = React.ComponentType<RouterProps>
