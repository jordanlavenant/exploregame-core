import type {
  CreateScriptMutation,
  CreateScriptInput,
  CreateScriptMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

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
    <ScriptForm onSave={onSave} loading={loading} error={error} />
  )
}

export default NewScript
