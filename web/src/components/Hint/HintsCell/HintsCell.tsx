import type { FindHints, FindHintsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Hints from 'src/components/Hint/Hints'

export const QUERY: TypedDocumentNode<FindHints, FindHintsVariables> = gql`
  query FindHints {
    hints {
      id
      help
      questionId
      hintLevelId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No hints yet.{' '}
      <Link to={routes.newHint()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindHints>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  hints,
}: CellSuccessProps<FindHints, FindHintsVariables>) => {
  return <Hints hints={hints} />
}
