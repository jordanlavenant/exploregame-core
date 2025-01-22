import type {
  DeletePlayerMutation,
  DeletePlayerMutationVariables,
  FindPlayerById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

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

interface Props {
  player: NonNullable<FindPlayerById['player']>
}

const Player = ({ player }: Props) => {
  const [deletePlayer] = useMutation(DELETE_PLAYER_MUTATION, {
    onCompleted: () => {
      toast.success('Player deleted')
      navigate(routes.players())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeletePlayerMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete player ' + id + '?')) {
      deletePlayer({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Player {player.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{player.id}</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{player.username}</td>
            </tr>
            <tr>
              <th>Hashed password</th>
              <td>{player.hashedPassword}</td>
            </tr>
            <tr>
              <th>Department id</th>
              <td>{player.departmentId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editPlayer({ id: player.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(player.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Player
