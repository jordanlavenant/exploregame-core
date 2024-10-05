import type { FindStatuses, FindStatusesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Statuses from 'src/components/Status/Statuses'

export const QUERY: TypedDocumentNode<FindStatuses, FindStatusesVariables> =
  gql`
    query FindStatuses {
      statuses {
        id
        status
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No statuses yet.{' '}
      <Link to={routes.newStatus()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindStatuses>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  statuses,
}: CellSuccessProps<FindStatuses, FindStatusesVariables>) => {
  return <Statuses statuses={statuses} />
}
