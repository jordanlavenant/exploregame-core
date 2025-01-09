import type {
  CreateCharacterStepMutation,
  CreateCharacterStepInput,
  CreateCharacterStepMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import CharacterStepForm from 'src/components/CharacterStep/CharacterStepForm'

const CREATE_CHARACTER_STEP_MUTATION: TypedDocumentNode<
  CreateCharacterStepMutation,
  CreateCharacterStepMutationVariables
> = gql`
  mutation CreateCharacterStepMutation($input: CreateCharacterStepInput!) {
    createCharacterStep(input: $input) {
      id
    }
  }
`

const NewCharacterStep = () => {
  const [createCharacterStep, { loading, error }] = useMutation(
    CREATE_CHARACTER_STEP_MUTATION,
    {
      onCompleted: () => {
        toast.success('CharacterStep created')
        navigate(routes.characterSteps())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateCharacterStepInput) => {
    createCharacterStep({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New CharacterStep</h2>
      </header>
      <div className="rw-segment-main">
        <CharacterStepForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewCharacterStep
