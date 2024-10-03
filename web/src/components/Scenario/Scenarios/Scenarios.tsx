import type {
  DeleteScenarioMutation,
  DeleteScenarioMutationVariables,
  FindScenarios,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Scenario/ScenariosCell'
import { truncate } from 'src/lib/formatters'

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

const ScenariosList = ({ scenarios }: FindScenarios) => {
  const [deleteScenario] = useMutation(DELETE_SCENARIO_MUTATION, {
    onCompleted: () => {
      toast.success('Scenario deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteScenarioMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete scenario ' + id + '?')) {
      deleteScenario({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Scenario</th>
            <th>Description</th>
            <th>Word</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario) => (
            <tr key={scenario.id}>
              <td>{truncate(scenario.id)}</td>
              <td>{truncate(scenario.scenario)}</td>
              <td>{truncate(scenario.description)}</td>
              <td>{truncate(scenario.word)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.scenario({ id: scenario.id })}
                    title={'Show scenario ' + scenario.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editScenario({ id: scenario.id })}
                    title={'Edit scenario ' + scenario.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete scenario ' + scenario.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(scenario.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScenariosList
