import type { FindGenders, FindGendersVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Genders from 'src/components/Gender/Genders'

export const QUERY: TypedDocumentNode<FindGenders, FindGendersVariables> = gql`
  query FindGenders {
    genders {
      id
      gender
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No genders yet.{' '}
      <Link to={routes.newGender()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindGenders>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  genders,
}: CellSuccessProps<FindGenders, FindGendersVariables>) => {
  return <Genders genders={genders} />
}
