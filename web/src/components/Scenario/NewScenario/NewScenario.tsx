import type {
  CreateScenarioMutation,
  CreateScenarioInput,
  CreateScenarioMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ScenarioForm from 'src/components/Scenario/ScenarioForm'

const CREATE_SCENARIO_MUTATION: TypedDocumentNode<
  CreateScenarioMutation,
  CreateScenarioMutationVariables
> = gql`
  mutation CreateScenarioMutation($input: CreateScenarioInput!) {
    createScenario(input: $input) {
      id
    }
  }
`

const NewScenario = () => {
  const [createScenario, { loading, error }] = useMutation(
    CREATE_SCENARIO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Scenario created')
        navigate(routes.scenarios())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateScenarioInput) => {
    createScenario({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Scenario</h2>
      </header>
      <div className="rw-segment-main">
        <ScenarioForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewScenario
