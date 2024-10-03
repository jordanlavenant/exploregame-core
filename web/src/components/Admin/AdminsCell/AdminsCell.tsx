import type { FindAdmins, FindAdminsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Admins from 'src/components/Admin/Admins'

export const QUERY: TypedDocumentNode<FindAdmins, FindAdminsVariables> = gql`
  query FindAdmins {
    admins {
      id
      role
      idU
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No admins yet.{' '}
      <Link to={routes.newAdmin()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindAdmins>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  admins,
}: CellSuccessProps<FindAdmins, FindAdminsVariables>) => {
  return <Admins admins={admins} />
}
