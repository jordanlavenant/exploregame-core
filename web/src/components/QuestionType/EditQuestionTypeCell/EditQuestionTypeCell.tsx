import type {
  EditQuestionTypeById,
  UpdateQuestionTypeInput,
  UpdateQuestionTypeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "sonner"

import QuestionTypeForm from 'src/components/QuestionType/QuestionTypeForm'

export const QUERY: TypedDocumentNode<EditQuestionTypeById> = gql`
  query EditQuestionTypeById($id: String!) {
    questionType: questionType(id: $id) {
      id
      type
    }
  }
`

const UPDATE_QUESTION_TYPE_MUTATION: TypedDocumentNode<
  EditQuestionTypeById,
  UpdateQuestionTypeMutationVariables
> = gql`
  mutation UpdateQuestionTypeMutation(
    $id: String!
    $input: UpdateQuestionTypeInput!
  ) {
    updateQuestionType(id: $id, input: $input) {
      id
      type
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  questionType,
}: CellSuccessProps<EditQuestionTypeById>) => {
  const [updateQuestionType, { loading, error }] = useMutation(
    UPDATE_QUESTION_TYPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('QuestionType updated')
        navigate(routes.questionTypes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateQuestionTypeInput,
    id: EditQuestionTypeById['questionType']['id']
  ) => {
    updateQuestionType({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit QuestionType {questionType?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <QuestionTypeForm
          questionType={questionType}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
