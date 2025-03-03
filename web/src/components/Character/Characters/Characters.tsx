import type {
  DeleteCharacterMutation,
  DeleteCharacterMutationVariables,
  FindCharacters,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { QUERY } from 'src/components/Character/CharactersCell'
import { truncate } from 'src/lib/formatters'

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

const CharactersList = ({ characters }: FindCharacters) => {
  const [deleteCharacter] = useMutation(DELETE_CHARACTER_MUTATION, {
    onCompleted: () => {
      toast.success('Character deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteCharacterMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete character ' + id + '?')) {
      deleteCharacter({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom perso</th>
            <th>Description l</th>
            <th>Image</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((character) => (
            <tr key={character.id}>
              <td>{truncate(character.id)}</td>
              <td>{truncate(character.nomPerso)}</td>
              <td>{truncate(character.descriptionL)}</td>
              <td>{truncate(character.image)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.character({ id: character.id })}
                    title={'Show character ' + character.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editCharacter({ id: character.id })}
                    title={'Edit character ' + character.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete character ' + character.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(character.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CharactersList
