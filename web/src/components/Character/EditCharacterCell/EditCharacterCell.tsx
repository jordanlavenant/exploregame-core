import type {
  EditCharacterById,
  UpdateCharacterInput,
  UpdateCharacterMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "sonner"

import CharacterForm from 'src/components/Character/CharacterForm'

export const QUERY: TypedDocumentNode<EditCharacterById> = gql`
  query EditCharacterById($id: String!) {
    character: character(id: $id) {
      id
      nomPerso
      descriptionL
      image
    }
  }
`

const UPDATE_CHARACTER_MUTATION: TypedDocumentNode<
  EditCharacterById,
  UpdateCharacterMutationVariables
> = gql`
  mutation UpdateCharacterMutation(
    $id: String!
    $input: UpdateCharacterInput!
  ) {
    updateCharacter(id: $id, input: $input) {
      id
      nomPerso
      descriptionL
      image
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ character }: CellSuccessProps<EditCharacterById>) => {
  const [updateCharacter, { loading, error }] = useMutation(
    UPDATE_CHARACTER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Character updated')
        navigate(routes.characters())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateCharacterInput,
    id: EditCharacterById['character']['id']
  ) => {
    updateCharacter({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Character {character?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <CharacterForm
          character={character}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
