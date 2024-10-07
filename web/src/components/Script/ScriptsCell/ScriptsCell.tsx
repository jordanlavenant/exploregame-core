import type { FindScripts, FindScriptsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Scripts from 'src/components/Script/Scripts'

export const QUERY: TypedDocumentNode<FindScripts, FindScriptsVariables> = gql`
  query FindScripts {
    scripts {
      id
      name
      visible
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No scripts yet.{' '}
      <Link to={routes.newScript()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindScripts>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  scripts,
}: CellSuccessProps<FindScripts, FindScriptsVariables>) => {
  return <Scripts scripts={scripts} />
}
