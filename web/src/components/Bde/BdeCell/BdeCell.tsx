import type { FindBdeById, FindBdeByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Bde from 'src/components/Bde/Bde'

export const QUERY: TypedDocumentNode<FindBdeById, FindBdeByIdVariables> = gql`
  query FindBdeById($id: String!) {
    bde: bde(id: $id) {
      id
      name
      description
      logo
      departmentId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Bde not found</div>

export const Failure = ({ error }: CellFailureProps<FindBdeByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  bde,
}: CellSuccessProps<FindBdeById, FindBdeByIdVariables>) => {
  return <Bde bde={bde} />
}
