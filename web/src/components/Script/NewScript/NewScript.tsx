import type {
  CreateScriptMutation,
  CreateScriptInput,
  CreateScriptMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ScriptForm from 'src/components/Script/ScriptForm'

const CREATE_SCRIPT_MUTATION: TypedDocumentNode<
  CreateScriptMutation,
  CreateScriptMutationVariables
> = gql`
  mutation CreateScriptMutation($input: CreateScriptInput!) {
    createScript(input: $input) {
      id
    }
  }
`

const NewScript = () => {
  const [createScript, { loading, error }] = useMutation(
    CREATE_SCRIPT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Script created')
        navigate(routes.scripts())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateScriptInput) => {
    createScript({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Script</h2>
      </header>
      <div className="rw-segment-main">
        <ScriptForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewScript
