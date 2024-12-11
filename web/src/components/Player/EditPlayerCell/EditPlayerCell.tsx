import type {
  EditPlayerById,
  UpdatePlayerInput,
  UpdatePlayerMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import PlayerForm from 'src/components/Player/PlayerForm'

export const QUERY: TypedDocumentNode<EditPlayerById> = gql`
  query EditPlayerById($id: String!) {
    player: player(id: $id) {
      id
      email
      genderId
      firstName
      lastName
      hashedPassword
      departmentId
      profilePictureUrl
    }
  }
`

const UPDATE_PLAYER_MUTATION: TypedDocumentNode<
  EditPlayerById,
  UpdatePlayerMutationVariables
> = gql`
  mutation UpdatePlayerMutation($id: String!, $input: UpdatePlayerInput!) {
    updatePlayer(id: $id, input: $input) {
      id
      email
      genderId
      firstName
      lastName
      hashedPassword
      departmentId
      profilePictureUrl
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ player }: CellSuccessProps<EditPlayerById>) => {
  const [updatePlayer, { loading, error }] = useMutation(
    UPDATE_PLAYER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Player updated')
        navigate(routes.players())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdatePlayerInput,
    id: EditPlayerById['player']['id']
  ) => {
    updatePlayer({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Player {player?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <PlayerForm
          player={player}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
