import type { FindHintById, FindHintByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Hint from 'src/components/Hint/Hint'

export const QUERY: TypedDocumentNode<FindHintById, FindHintByIdVariables> =
  gql`
    query FindHintById($id: String!) {
      hint: hint(id: $id) {
        id
        help
        questionId
        hintLevelId
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Hint not found</div>

export const Failure = ({ error }: CellFailureProps<FindHintByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  hint,
}: CellSuccessProps<FindHintById, FindHintByIdVariables>) => {
  return <Hint hint={hint} />
}
