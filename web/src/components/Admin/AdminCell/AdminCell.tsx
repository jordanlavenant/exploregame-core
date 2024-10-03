import type { FindAdminById, FindAdminByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Admin from 'src/components/Admin/Admin'

export const QUERY: TypedDocumentNode<FindAdminById, FindAdminByIdVariables> =
  gql`
    query FindAdminById($id: String!) {
      admin: admin(id: $id) {
        id
        role
        idU
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Admin not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAdminByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  admin,
}: CellSuccessProps<FindAdminById, FindAdminByIdVariables>) => {
  return <Admin admin={admin} />
}
