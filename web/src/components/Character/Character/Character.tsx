import type {
  DeleteCharacterMutation,
  DeleteCharacterMutationVariables,
  FindCharacterById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_CHARACTER_MUTATION: TypedDocumentNode<
  DeleteCharacterMutation,
  DeleteCharacterMutationVariables
> = gql`
  mutation DeleteCharacterMutation($id: String!) {
    deleteCharacter(id: $id) {
      id
    }
  }
`

interface Props {
  character: NonNullable<FindCharacterById['character']>
}

const Character = ({ character }: Props) => {
  const [deleteCharacter] = useMutation(DELETE_CHARACTER_MUTATION, {
    onCompleted: () => {
      toast.success('Character deleted')
      navigate(routes.characters())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteCharacterMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete character ' + id + '?')) {
      deleteCharacter({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Character {character.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{character.id}</td>
            </tr>
            <tr>
              <th>Nom perso</th>
              <td>{character.nomPerso}</td>
            </tr>
            <tr>
              <th>Description l</th>
              <td>{character.descriptionL}</td>
            </tr>
            <tr>
              <th>Image</th>
              <td>{character.image}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editCharacter({ id: character.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(character.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Character
