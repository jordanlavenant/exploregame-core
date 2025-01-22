import type {
  DeletePlayerMutation,
  DeletePlayerMutationVariables,
  FindPlayers,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Player/PlayersCell'
import { truncate } from 'src/lib/formatters'

const DELETE_PLAYER_MUTATION: TypedDocumentNode<
  DeletePlayerMutation,
  DeletePlayerMutationVariables
> = gql`
  mutation DeletePlayerMutation($id: String!) {
    deletePlayer(id: $id) {
      id
    }
  }
`

const PlayersList = ({ players }: FindPlayers) => {
  const [deletePlayer] = useMutation(DELETE_PLAYER_MUTATION, {
    onCompleted: () => {
      toast.success('Player deleted')
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

  const onDeleteClick = (id: DeletePlayerMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete player ' + id + '?')) {
      deletePlayer({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Hashed password</th>
            <th>Department id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{truncate(player.id)}</td>
              <td>{truncate(player.username)}</td>
              <td>{truncate(player.hashedPassword)}</td>
              <td>{truncate(player.departmentId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.player({ id: player.id })}
                    title={'Show player ' + player.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editPlayer({ id: player.id })}
                    title={'Edit player ' + player.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete player ' + player.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(player.id)}
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

export default PlayersList
