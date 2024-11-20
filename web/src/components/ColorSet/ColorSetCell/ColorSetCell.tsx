import type { FindColorSetById, FindColorSetByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import ColorSet from 'src/components/ColorSet/ColorSet'

export const QUERY: TypedDocumentNode<
  FindColorSetById,
  FindColorSetByIdVariables
> = gql`
  query FindColorSetById($id: String!) {
    colorSet: colorSet(id: $id) {
      id
      primary
      secondary
      tertiary
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>ColorSet not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindColorSetByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  colorSet,
}: CellSuccessProps<FindColorSetById, FindColorSetByIdVariables>) => {
  return <ColorSet colorSet={colorSet} />
}
