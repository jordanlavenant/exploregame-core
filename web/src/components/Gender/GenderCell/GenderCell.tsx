import type { FindGenderById, FindGenderByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Gender from 'src/components/Gender/Gender'

export const QUERY: TypedDocumentNode<FindGenderById, FindGenderByIdVariables> =
  gql`
    query FindGenderById($id: String!) {
      gender: gender(id: $id) {
        id
        gender
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Gender not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindGenderByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  gender,
}: CellSuccessProps<FindGenderById, FindGenderByIdVariables>) => {
  return <Gender gender={gender} />
}
