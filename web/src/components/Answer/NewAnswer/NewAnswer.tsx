import type {
  CreateAnswerMutation,
  CreateAnswerInput,
  CreateAnswerMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import AnswerForm from 'src/components/Answer/AnswerForm'

const CREATE_ANSWER_MUTATION: TypedDocumentNode<
  CreateAnswerMutation,
  CreateAnswerMutationVariables
> = gql`
  mutation CreateAnswerMutation($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      id
    }
  }
`

const NewAnswer = () => {
  const [createAnswer, { loading, error }] = useMutation(
    CREATE_ANSWER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Answer created')
        navigate(routes.answers())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateAnswerInput) => {
    createAnswer({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Answer</h2>
      </header>
      <div className="rw-segment-main">
        <AnswerForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewAnswer
