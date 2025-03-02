import type {
  CreateQuestionTypeMutation,
  CreateQuestionTypeInput,
  CreateQuestionTypeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import QuestionTypeForm from 'src/components/QuestionType/QuestionTypeForm'

const CREATE_QUESTION_TYPE_MUTATION: TypedDocumentNode<
  CreateQuestionTypeMutation,
  CreateQuestionTypeMutationVariables
> = gql`
  mutation CreateQuestionTypeMutation($input: CreateQuestionTypeInput!) {
    createQuestionType(input: $input) {
      id
    }
  }
`

const NewQuestionType = () => {
  const [createQuestionType, { loading, error }] = useMutation(
    CREATE_QUESTION_TYPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('QuestionType created')
        navigate(routes.questionTypes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateQuestionTypeInput) => {
    createQuestionType({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New QuestionType</h2>
      </header>
      <div className="rw-segment-main">
        <QuestionTypeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewQuestionType
