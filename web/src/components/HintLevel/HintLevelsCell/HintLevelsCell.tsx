import type { FindHintLevels, FindHintLevelsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import HintLevels from 'src/components/HintLevel/HintLevels'

export const QUERY: TypedDocumentNode<FindHintLevels, FindHintLevelsVariables> =
  gql`
    query FindHintLevels {
      hintLevels {
        id
        type
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No hintLevels yet.{' '}
      <Link to={routes.newHintLevel()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindHintLevels>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  hintLevels,
}: CellSuccessProps<FindHintLevels, FindHintLevelsVariables>) => {
  return <HintLevels hintLevels={hintLevels} />
}
