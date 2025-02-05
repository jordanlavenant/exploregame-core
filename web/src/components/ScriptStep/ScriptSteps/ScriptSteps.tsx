import type {
  DeleteScriptStepMutation,
  DeleteScriptStepMutationVariables,
  FindScriptSteps,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/ScriptStep/ScriptStepsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_SCRIPT_STEP_MUTATION: TypedDocumentNode<
  DeleteScriptStepMutation,
  DeleteScriptStepMutationVariables
> = gql`
  mutation DeleteScriptStepMutation($id: String!) {
    deleteScriptStep(id: $id) {
      id
    }
  }
`

const ScriptStepsList = ({ scriptSteps }: FindScriptSteps) => {
  const [deleteScriptStep] = useMutation(DELETE_SCRIPT_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('ScriptStep deleted')
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

  const onDeleteClick = (id: DeleteScriptStepMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete scriptStep ' + id + '?')) {
      deleteScriptStep({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Nom du scénario</th>
            <th>Step id</th>
            <th>Lettre</th>
            <th>Order</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {scriptSteps.map((scriptStep) => (
            <tr key={scriptStep.id}>
              <td>{truncate(scriptStep.Script.name)}</td>
              <td>{truncate(scriptStep.stepId)}</td>
              <td>{truncate(scriptStep.lettre)}</td>
              <td>{truncate(scriptStep.order)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.scriptStep({ id: scriptStep.id })}
                    title={'Show scriptStep ' + scriptStep.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editScriptStep({ id: scriptStep.id })}
                    title={'Edit scriptStep ' + scriptStep.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete scriptStep ' + scriptStep.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(scriptStep.id)}
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

export default ScriptStepsList
