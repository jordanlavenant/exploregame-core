import type {
  EditAnswerById,
  UpdateAnswerInput,
  UpdateAnswerMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AnswerForm from 'src/components/Answer/AnswerForm'

export const QUERY: TypedDocumentNode<EditAnswerById> = gql`
  query EditAnswerById($id: String!) {
    answer: answer(id: $id) {
      id
      answer
      description
      idQ
    }
  }
`

const UPDATE_ANSWER_MUTATION: TypedDocumentNode<
  EditAnswerById,
  UpdateAnswerMutationVariables
> = gql`
  mutation UpdateAnswerMutation($id: String!, $input: UpdateAnswerInput!) {
    updateAnswer(id: $id, input: $input) {
      id
      answer
      description
      idQ
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ answer }: CellSuccessProps<EditAnswerById>) => {
  const [updateAnswer, { loading, error }] = useMutation(
    UPDATE_ANSWER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Answer updated')
        navigate(routes.answers())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateAnswerInput,
    id: EditAnswerById['answer']['id']
  ) => {
    updateAnswer({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Answer {answer?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <AnswerForm
          answer={answer}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
