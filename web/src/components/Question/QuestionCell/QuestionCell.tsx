import type { FindQuestionById, FindQuestionByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Question from 'src/components/Question/Question'

export const QUERY: TypedDocumentNode<
  FindQuestionById,
  FindQuestionByIdVariables
> = gql`
  query FindQuestionById($id: String!) {
    question: question(id: $id) {
      id
      question
      description
      QuestionType {
        id
        type
      }
      Step {
        id
        name
      }
      Answer {
        id
        description
        answer
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Question not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindQuestionByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  question,
}: CellSuccessProps<FindQuestionById, FindQuestionByIdVariables>) => {
  return <Question question={question} />
}
