import type { FindUserById, FindUserByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import User from 'src/components/User/User'

export const QUERY: TypedDocumentNode<FindUserById, FindUserByIdVariables> =
  gql`
    query FindUserById($id: String!) {
      user: user(id: $id) {
        id
        email
        hashedPassword
        salt
        resetToken
        resetTokenExpiresAt
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>User not found</div>

export const Failure = ({ error }: CellFailureProps<FindUserByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  user,
}: CellSuccessProps<FindUserById, FindUserByIdVariables>) => {
  return <User user={user} />
}
