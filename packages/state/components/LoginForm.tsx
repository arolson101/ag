import React, { PureComponent } from 'react'
import { propType } from 'graphql-anywhere'
import gql from 'graphql-tag'

interface Props {
  entry: {
    score: number
    vote: {
      vote_value: number
    }
  }
}

export class LoginForm extends PureComponent<Props> {
  public static readonly fragments = {
    entry: gql`
      fragment LoginForm on Entry {
        score
        vote {
          vote_value
        }
      }
    `,
  }

  public static readonly propTypes = {
    entry: propType(LoginForm.fragments.entry),
  }

  public render() {
    return <>foo</>
  }
}
