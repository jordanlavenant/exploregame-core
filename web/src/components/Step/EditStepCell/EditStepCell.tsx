import type {
  EditStepById,
  UpdateStepInput,
  UpdateStepMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import StepForm from 'src/components/Step/StepForm'

export const QUERY: TypedDocumentNode<EditStepById> = gql`
  query EditStepById($id: String!) {
    step: step(id: $id) {
      id
      name
      locationId
    }
  }
`

const UPDATE_STEP_MUTATION: TypedDocumentNode<
  EditStepById,
  UpdateStepMutationVariables
> = gql`
  mutation UpdateStepMutation($id: String!, $input: UpdateStepInput!) {
    updateStep(id: $id, input: $input) {
      id
      name
      locationId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ step }: CellSuccessProps<EditStepById>) => {
  const [updateStep, { loading, error }] = useMutation(UPDATE_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('Step updated')
      navigate(routes.steps())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: UpdateStepInput, id: EditStepById['step']['id']) => {
    updateStep({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Step {step?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <StepForm step={step} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
