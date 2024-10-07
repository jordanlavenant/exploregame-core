import type {
  DeletePlayerScriptMutation,
  DeletePlayerScriptMutationVariables,
  FindPlayerScripts,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/PlayerScript/PlayerScriptsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_PLAYER_SCRIPT_MUTATION: TypedDocumentNode<
  DeletePlayerScriptMutation,
  DeletePlayerScriptMutationVariables
> = gql`
  mutation DeletePlayerScriptMutation($id: String!) {
    deletePlayerScript(id: $id) {
      id
    }
  }
`

const PlayerScriptsList = ({ playerScripts }: FindPlayerScripts) => {
  const [deletePlayerScript] = useMutation(DELETE_PLAYER_SCRIPT_MUTATION, {
    onCompleted: () => {
      toast.success('PlayerScript deleted')
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

  const onDeleteClick = (id: DeletePlayerScriptMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete playerScript ' + id + '?')) {
      deletePlayerScript({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Player id</th>
            <th>Script id</th>
            <th>Score</th>
            <th>Remaining time</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {playerScripts.map((playerScript) => (
            <tr key={playerScript.id}>
              <td>{truncate(playerScript.id)}</td>
              <td>{truncate(playerScript.playerId)}</td>
              <td>{truncate(playerScript.scriptId)}</td>
              <td>{truncate(playerScript.score)}</td>
              <td>{truncate(playerScript.remainingTime)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.playerScript({ id: playerScript.id })}
                    title={'Show playerScript ' + playerScript.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editPlayerScript({ id: playerScript.id })}
                    title={'Edit playerScript ' + playerScript.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete playerScript ' + playerScript.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(playerScript.id)}
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

export default PlayerScriptsList
