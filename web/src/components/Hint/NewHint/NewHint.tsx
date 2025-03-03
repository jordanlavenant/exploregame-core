import type {
  CreateHintMutation,
  CreateHintInput,
  CreateHintMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import HintForm from 'src/components/Hint/HintForm'

const CREATE_HINT_MUTATION: TypedDocumentNode<
  CreateHintMutation,
  CreateHintMutationVariables
> = gql`
  mutation CreateHintMutation($input: CreateHintInput!) {
    createHint(input: $input) {
      id
    }
  }
`

const NewHint = () => {
  const [createHint, { loading, error }] = useMutation(CREATE_HINT_MUTATION, {
    onCompleted: () => {
      toast.success('Hint created')
      navigate(routes.hints())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: CreateHintInput) => {
    createHint({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Hint</h2>
      </header>
      <div className="rw-segment-main">
        <HintForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewHint
