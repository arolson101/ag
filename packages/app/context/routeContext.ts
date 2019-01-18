import React from 'react'
import { AppRouteFunction } from '../pages'

export interface RouteConfig {
  [path: string]: React.ComponentType<any> | React.ComponentType<void>
}

export interface RouterProps {
  routes: RouteConfig
}

export type Router = React.ComponentType<RouterProps>

export interface RouteContext {
  push: AppRouteFunction
  dialog: AppRouteFunction
  replace: AppRouteFunction
  pop: () => any
}
