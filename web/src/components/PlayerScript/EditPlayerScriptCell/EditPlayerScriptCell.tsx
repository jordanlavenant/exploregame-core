import type {
  EditPlayerScriptById,
  UpdatePlayerScriptInput,
  UpdatePlayerScriptMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import PlayerScriptForm from 'src/components/PlayerScript/PlayerScriptForm'

export const QUERY: TypedDocumentNode<EditPlayerScriptById> = gql`
  query EditPlayerScriptById($id: String!) {
    playerScript: playerScript(id: $id) {
      id
      playerId
      scriptId
      stepId
      score
      remainingTime
    }
  }
`

const UPDATE_PLAYER_SCRIPT_MUTATION: TypedDocumentNode<
  EditPlayerScriptById,
  UpdatePlayerScriptMutationVariables
> = gql`
  mutation UpdatePlayerScriptMutation(
    $id: String!
    $input: UpdatePlayerScriptInput!
  ) {
    updatePlayerScript(id: $id, input: $input) {
      id
      playerId
      scriptId
      stepId
      score
      remainingTime
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  playerScript,
}: CellSuccessProps<EditPlayerScriptById>) => {
  const [updatePlayerScript, { loading, error }] = useMutation(
    UPDATE_PLAYER_SCRIPT_MUTATION,
    {
      onCompleted: () => {
        toast.success('PlayerScript updated')
        navigate(routes.playerScripts())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdatePlayerScriptInput,
    id: EditPlayerScriptById['playerScript']['id']
  ) => {
    updatePlayerScript({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit PlayerScript {playerScript?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <PlayerScriptForm
          playerScript={playerScript}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
