import type {
  DeletePlayerScriptMutation,
  DeletePlayerScriptMutationVariables,
  FindPlayerScriptById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { checkboxInputTag } from 'src/lib/formatters'

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

interface Props {
  playerScript: NonNullable<FindPlayerScriptById['playerScript']>
}

const PlayerScript = ({ playerScript }: Props) => {
  const [deletePlayerScript] = useMutation(DELETE_PLAYER_SCRIPT_MUTATION, {
    onCompleted: () => {
      toast.success('PlayerScript deleted')
      navigate(routes.playerScripts())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeletePlayerScriptMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete playerScript ' + id + '?')) {
      deletePlayerScript({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            PlayerScript {playerScript.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{playerScript.id}</td>
            </tr>
            <tr>
              <th>Player id</th>
              <td>{playerScript.playerId}</td>
            </tr>
            <tr>
              <th>Script id</th>
              <td>{playerScript.scriptId}</td>
            </tr>
            <tr>
              <th>Step id</th>
              <td>{playerScript.stepId}</td>
            </tr>
            <tr>
              <th>Question id</th>
              <td>{playerScript.questionId}</td>
            </tr>
            <tr>
              <th>Completed</th>
              <td>{checkboxInputTag(playerScript.completed)}</td>
            </tr>
            <tr>
              <th>Score</th>
              <td>{playerScript.score}</td>
            </tr>
            <tr>
              <th>Remaining time</th>
              <td>{playerScript.remainingTime}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editPlayerScript({ id: playerScript.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(playerScript.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default PlayerScript
