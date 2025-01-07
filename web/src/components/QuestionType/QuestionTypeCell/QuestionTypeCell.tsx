import type {
  FindQuestionTypeById,
  FindQuestionTypeByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import QuestionType from 'src/components/QuestionType/QuestionType'

export const QUERY: TypedDocumentNode<
  FindQuestionTypeById,
  FindQuestionTypeByIdVariables
> = gql`
  query FindQuestionTypeById($id: String!) {
    questionType: questionType(id: $id) {
      id
      type
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>QuestionType not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindQuestionTypeByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  questionType,
}: CellSuccessProps<FindQuestionTypeById, FindQuestionTypeByIdVariables>) => {
  return <QuestionType questionType={questionType} />
}
