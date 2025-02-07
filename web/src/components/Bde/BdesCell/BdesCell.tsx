import type { FindBdes, FindBdesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Bdes from 'src/components/Bde/Bdes'

export const QUERY: TypedDocumentNode<FindBdes, FindBdesVariables> = gql`
  query FindBdes {
    bdes {
      id
      name
      description
      logo
      Department {
        id
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No bdes yet.{' '}
      <Link to={routes.newBde()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindBdes>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  bdes,
}: CellSuccessProps<FindBdes, FindBdesVariables>) => {
  return <Bdes bdes={bdes} />
}
