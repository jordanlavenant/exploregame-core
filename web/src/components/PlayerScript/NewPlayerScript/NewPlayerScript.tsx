import type {
  CreatePlayerScriptMutation,
  CreatePlayerScriptInput,
  CreatePlayerScriptMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import PlayerScriptForm from 'src/components/PlayerScript/PlayerScriptForm'

const CREATE_PLAYER_SCRIPT_MUTATION: TypedDocumentNode<
  CreatePlayerScriptMutation,
  CreatePlayerScriptMutationVariables
> = gql`
  mutation CreatePlayerScriptMutation($input: CreatePlayerScriptInput!) {
    createPlayerScript(input: $input) {
      id
    }
  }
`

const NewPlayerScript = () => {
  const [createPlayerScript, { loading, error }] = useMutation(
    CREATE_PLAYER_SCRIPT_MUTATION,
    {
      onCompleted: () => {
        toast.success('PlayerScript created')
        navigate(routes.playerScripts())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreatePlayerScriptInput) => {
    createPlayerScript({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New PlayerScript</h2>
      </header>
      <div className="rw-segment-main">
        <PlayerScriptForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewPlayerScript
