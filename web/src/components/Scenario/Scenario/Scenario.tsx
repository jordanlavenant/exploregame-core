import type {
  DeleteScenarioMutation,
  DeleteScenarioMutationVariables,
  FindScenarioById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_SCENARIO_MUTATION: TypedDocumentNode<
  DeleteScenarioMutation,
  DeleteScenarioMutationVariables
> = gql`
  mutation DeleteScenarioMutation($id: String!) {
    deleteScenario(id: $id) {
      id
    }
  }
`

interface Props {
  scenario: NonNullable<FindScenarioById['scenario']>
}

const Scenario = ({ scenario }: Props) => {
  const [deleteScenario] = useMutation(DELETE_SCENARIO_MUTATION, {
    onCompleted: () => {
      toast.success('Scenario deleted')
      navigate(routes.scenarios())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteScenarioMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete scenario ' + id + '?')) {
      deleteScenario({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Scenario {scenario.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{scenario.id}</td>
            </tr>
            <tr>
              <th>Scenario</th>
              <td>{scenario.scenario}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{scenario.description}</td>
            </tr>
            <tr>
              <th>Word</th>
              <td>{scenario.word}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editScenario({ id: scenario.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(scenario.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Scenario
