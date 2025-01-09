import type {
  FindHintLevelById,
  FindHintLevelByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import HintLevel from 'src/components/HintLevel/HintLevel'

export const QUERY: TypedDocumentNode<
  FindHintLevelById,
  FindHintLevelByIdVariables
> = gql`
  query FindHintLevelById($id: String!) {
    hintLevel: hintLevel(id: $id) {
      id
      type
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>HintLevel not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindHintLevelByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  hintLevel,
}: CellSuccessProps<FindHintLevelById, FindHintLevelByIdVariables>) => {
  return <HintLevel hintLevel={hintLevel} />
}
