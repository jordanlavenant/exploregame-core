import type {
  EditScenarioById,
  UpdateScenarioInput,
  UpdateScenarioMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ScenarioForm from 'src/components/Scenario/ScenarioForm'

export const QUERY: TypedDocumentNode<EditScenarioById> = gql`
  query EditScenarioById($id: String!) {
    scenario: scenario(id: $id) {
      id
      scenario
      description
      word
    }
  }
`

const UPDATE_SCENARIO_MUTATION: TypedDocumentNode<
  EditScenarioById,
  UpdateScenarioMutationVariables
> = gql`
  mutation UpdateScenarioMutation($id: String!, $input: UpdateScenarioInput!) {
    updateScenario(id: $id, input: $input) {
      id
      scenario
      description
      word
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ scenario }: CellSuccessProps<EditScenarioById>) => {
  const [updateScenario, { loading, error }] = useMutation(
    UPDATE_SCENARIO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Scenario updated')
        navigate(routes.scenarios())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateScenarioInput,
    id: EditScenarioById['scenario']['id']
  ) => {
    updateScenario({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Scenario {scenario?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ScenarioForm
          scenario={scenario}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
