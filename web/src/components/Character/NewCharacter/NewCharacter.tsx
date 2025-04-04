import type {
  CreateCharacterMutation,
  CreateCharacterInput,
  CreateCharacterMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import CharacterForm from 'src/components/Character/CharacterForm'

const CREATE_CHARACTER_MUTATION: TypedDocumentNode<
  CreateCharacterMutation,
  CreateCharacterMutationVariables
> = gql`
  mutation CreateCharacterMutation($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      id
    }
  }
`

const NewCharacter = () => {
  const [createCharacter, { loading, error }] = useMutation(
    CREATE_CHARACTER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Character created')
        navigate(routes.characters())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateCharacterInput) => {
    createCharacter({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Character</h2>
      </header>
      <div className="rw-segment-main">
        <CharacterForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewCharacter
