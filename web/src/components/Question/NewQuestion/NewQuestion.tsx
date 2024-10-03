import type {
  CreateQuestionMutation,
  CreateQuestionInput,
  CreateQuestionMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import QuestionForm from 'src/components/Question/QuestionForm'

const CREATE_QUESTION_MUTATION: TypedDocumentNode<
  CreateQuestionMutation,
  CreateQuestionMutationVariables
> = gql`
  mutation CreateQuestionMutation($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      id
    }
  }
`

const NewQuestion = () => {
  const [createQuestion, { loading, error }] = useMutation(
    CREATE_QUESTION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Question created')
        navigate(routes.questions())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateQuestionInput) => {
    createQuestion({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Question</h2>
      </header>
      <div className="rw-segment-main">
        <QuestionForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewQuestion
