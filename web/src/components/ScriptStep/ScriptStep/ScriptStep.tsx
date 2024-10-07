import type {
  DeleteScriptStepMutation,
  DeleteScriptStepMutationVariables,
  FindScriptStepById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

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

interface Props {
  scriptStep: NonNullable<FindScriptStepById['scriptStep']>
}

const ScriptStep = ({ scriptStep }: Props) => {
  const [deleteScriptStep] = useMutation(DELETE_SCRIPT_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('ScriptStep deleted')
      navigate(routes.scriptSteps())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteScriptStepMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete scriptStep ' + id + '?')) {
      deleteScriptStep({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            ScriptStep {scriptStep.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{scriptStep.id}</td>
            </tr>
            <tr>
              <th>Script id</th>
              <td>{scriptStep.scriptId}</td>
            </tr>
            <tr>
              <th>Step id</th>
              <td>{scriptStep.stepId}</td>
            </tr>
            <tr>
              <th>Lettre</th>
              <td>{scriptStep.lettre}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editScriptStep({ id: scriptStep.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(scriptStep.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default ScriptStep
