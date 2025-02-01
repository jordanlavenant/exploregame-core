import type { FindNewses, FindNewsesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Newses from 'src/components/News/Newses'

export const QUERY: TypedDocumentNode<FindNewses, FindNewsesVariables> = gql`
  query FindNewses {
    newses {
      id
      titre
      description
      date
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No newses yet.{' '}
      <Link to={routes.newNews()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindNewses>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  newses,
}: CellSuccessProps<FindNewses, FindNewsesVariables>) => {
  return <Newses newses={newses} />
}
