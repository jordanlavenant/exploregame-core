import type {
  EditQuestionById,
  UpdateQuestionInput,
  UpdateQuestionMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "sonner"

import QuestionForm from 'src/components/Question/QuestionForm'

export const QUERY: TypedDocumentNode<EditQuestionById> = gql`
  query EditQuestionById($id: String!) {
    question: question(id: $id) {
      id
      question
      description
      questionTypeId
      stepId
      order
      Answer {
        id
        answer
        description
        isCorrect
        questionId
      }
      Hint {
        id
        help
        hintLevelId
        questionId
      }
    }
  }
`

const UPDATE_QUESTION_MUTATION: TypedDocumentNode<
  EditQuestionById,
  UpdateQuestionMutationVariables
> = gql`
  mutation UpdateQuestionMutation($id: String!, $input: UpdateQuestionInput!) {
    updateQuestion(id: $id, input: $input) {
      id
      question
      description
      questionTypeId
      stepId
      order
      Answer {
        id
      }
      Hint {
        id
        questionId
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ question }: CellSuccessProps<EditQuestionById>) => {
  const [updateQuestion, { loading, error }] = useMutation(
    UPDATE_QUESTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Question updated')
        navigate(routes.questions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = async (
    input: UpdateQuestionInput,
    id: EditQuestionById['question']['id']
  ) => {
    const response = await updateQuestion({ variables: { id, input } })
    return response.data
  }

  return (
    <QuestionForm
      question={question}
      onSave={onSave}
      error={error}
      loading={loading}
    />
  )
}
