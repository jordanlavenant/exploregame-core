import type {
  CreateStepMutation,
  CreateStepInput,
  CreateStepMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import StepForm from 'src/components/Step/StepForm'

const CREATE_STEP_MUTATION: TypedDocumentNode<
  CreateStepMutation,
  CreateStepMutationVariables
> = gql`
  mutation CreateStepMutation($input: CreateStepInput!) {
    createStep(input: $input) {
      id
    }
  }
`

const NewStep = () => {
  const [createStep, { loading, error }] = useMutation(CREATE_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('Step created')
      navigate(routes.steps())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: CreateStepInput) => {
    createStep({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Step</h2>
      </header>
      <div className="rw-segment-main">
        <StepForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewStep
