import React from 'react'

export interface Location<T extends {} = object> {
  path: string
  state: T
}

export interface RouteProps<T extends {} = object> {
  location: Location<T>
}

export interface RouteConfig {
  [path: string]: React.ComponentType<RouteProps<any>>
}

export interface RouterProps {
  routes: RouteConfig
}

export type Router = React.ComponentType<RouterProps>
