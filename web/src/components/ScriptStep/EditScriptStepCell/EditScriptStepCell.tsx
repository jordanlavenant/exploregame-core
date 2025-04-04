import type {
  EditScriptStepById,
  UpdateScriptStepInput,
  UpdateScriptStepMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from "sonner"

import ScriptStepForm from 'src/components/ScriptStep/ScriptStepForm'

export const QUERY: TypedDocumentNode<EditScriptStepById> = gql`
  query EditScriptStepById($id: String!) {
    scriptStep: scriptStep(id: $id) {
      id
      scriptId
      stepId
      lettre
      order
      Step {
        id
        name
        Location {
          id
        }
      }
    }
  }
`

const UPDATE_SCRIPT_STEP_MUTATION: TypedDocumentNode<
  EditScriptStepById,
  UpdateScriptStepMutationVariables
> = gql`
  mutation UpdateScriptStepMutation(
    $id: String!
    $input: UpdateScriptStepInput!
  ) {
    updateScriptStep(id: $id, input: $input) {
      id
      scriptId
      stepId
      lettre
      order
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  scriptStep,
}: CellSuccessProps<EditScriptStepById>) => {
  const { refetch } = useQuery(QUERY, {
    variables: { id: scriptStep.id },
    fetchPolicy: 'network-only',
  })
  const [updateScriptStep, { loading, error }] = useMutation(
    UPDATE_SCRIPT_STEP_MUTATION,
    {
      onCompleted: () => {
        toast.success('ScriptStep updated')
        navigate(routes.scriptSteps())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateScriptStepInput,
    id: EditScriptStepById['scriptStep']['id']
  ) => {
    updateScriptStep({ variables: { id, input } })
    refetch()
  }

  return (
    <ScriptStepForm
      scriptStep={scriptStep}
      onSave={onSave}
      error={error}
      loading={loading}
    />
  )
}
