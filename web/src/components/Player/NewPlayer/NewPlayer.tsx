import type {
  CreatePlayerMutation,
  CreatePlayerInput,
  CreatePlayerMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import PlayerForm from 'src/components/Player/PlayerForm'

const CREATE_PLAYER_MUTATION: TypedDocumentNode<
  CreatePlayerMutation,
  CreatePlayerMutationVariables
> = gql`
  mutation CreatePlayerMutation($input: CreatePlayerInput!) {
    createPlayer(input: $input) {
      id
    }
  }
`

const NewPlayer = () => {
  const [createPlayer, { loading, error }] = useMutation(
    CREATE_PLAYER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Player created')
        navigate(routes.players())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreatePlayerInput) => {
    createPlayer({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Player</h2>
      </header>
      <div className="rw-segment-main">
        <PlayerForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewPlayer
