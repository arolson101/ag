import { filter } from 'graphql-anywhere'
import gql from 'graphql-tag'
import React, { PureComponent } from 'react'
import { LoginForm } from '../components/LoginForm'

interface Props {
  create: boolean
}

export class LoginPage extends PureComponent<Props> {
  static readonly url = '/login'
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
