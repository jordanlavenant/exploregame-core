import type { FindStatusById, FindStatusByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Status from 'src/components/Status/Status'

export const QUERY: TypedDocumentNode<FindStatusById, FindStatusByIdVariables> =
  gql`
    query FindStatusById($id: String!) {
      status: status(id: $id) {
        id
        status
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Status not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindStatusByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  status,
}: CellSuccessProps<FindStatusById, FindStatusByIdVariables>) => {
  return <Status status={status} />
}
