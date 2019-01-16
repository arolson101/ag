import React from 'react'

export interface RouteConfig {
  [path: string]: React.ComponentType
}

export interface RouterProps {
  routes: RouteConfig
}

export type Router = React.ComponentType<RouterProps>

export interface RouteContext {
  push: (path: string) => any
  pop: () => any
  replace: (path: string) => any
}
