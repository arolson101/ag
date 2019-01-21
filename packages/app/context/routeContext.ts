import React from 'react'

export interface RouterProps {
  isLoggedIn: boolean
}

export type Router = React.ComponentType<RouterProps>
