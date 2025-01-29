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
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ question }: CellSuccessProps<EditQuestionById>) => {
  const { refetch } = useQuery(QUERY, {
    variables: { id: question.id },
    fetchPolicy: 'network-only',
  })
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

  const onSave = (
    input: UpdateQuestionInput,
    id: EditQuestionById['question']['id']
  ) => {
    updateQuestion({ variables: { id, input } })
    refetch()
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
