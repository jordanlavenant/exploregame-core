import type {
  CreateScriptStepMutation,
  CreateScriptStepInput,
  CreateScriptStepMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import ScriptStepForm from 'src/components/ScriptStep/ScriptStepForm'

const CREATE_SCRIPT_STEP_MUTATION: TypedDocumentNode<
  CreateScriptStepMutation,
  CreateScriptStepMutationVariables
> = gql`
  mutation CreateScriptStepMutation($input: CreateScriptStepInput!) {
    createScriptStep(input: $input) {
      id
    }
  }
`

const NewScriptStep = () => {
  const [createScriptStep, { loading, error }] = useMutation(
    CREATE_SCRIPT_STEP_MUTATION,
    {
      onCompleted: () => {
        toast.success('ScriptStep created')
        navigate(routes.scriptSteps())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateScriptStepInput) => {
    createScriptStep({ variables: { input } })
  }

  return (
    <ScriptStepForm onSave={onSave} loading={loading} error={error} />
  )
}

export default NewScriptStep
