import type { FindAnswerById, FindAnswerByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Answer from 'src/components/Answer/Answer'

export const QUERY: TypedDocumentNode<FindAnswerById, FindAnswerByIdVariables> =
  gql`
    query FindAnswerById($id: String!) {
      answer: answer(id: $id) {
        id
        answer
        description
        idQ
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Answer not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAnswerByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  answer,
}: CellSuccessProps<FindAnswerById, FindAnswerByIdVariables>) => {
  return <Answer answer={answer} />
}
