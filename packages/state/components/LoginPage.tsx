import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { LoginForm } from './LoginForm'
import { filter } from 'graphql-anywhere'

interface Props {
  create: boolean
}

export class LoginPageComponent extends PureComponent<Props> {
  static readonly fragments = {
    entry: gql`
      fragment FeedEntry on Entry {
        commentCount
        repository {
          full_name
          html_url
          owner {
            avatar_url
          }
        }
        ...VoteButtons
        ...RepoInfo
      }
      ${LoginForm.fragments.entry}
    `,
  }

  static readonly query = gql`
    query Comment($repoName: String!) {
      entry(repoFullName: $repoName) {
        comments {
          ...CommentsPageComment
        }
      }
    }
    ${LoginForm.fragments.entry}
  `

  static readonly propTypes = {}

  render() {
    return (
      <>
        <LoginForm entry={filter(LoginForm.fragments.entry, entry)} />
      </>
    )
  }
}
