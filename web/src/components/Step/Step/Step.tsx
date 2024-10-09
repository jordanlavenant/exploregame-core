import type {
  DeleteStepMutation,
  DeleteStepMutationVariables,
  FindStepById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_STEP_MUTATION: TypedDocumentNode<
  DeleteStepMutation,
  DeleteStepMutationVariables
> = gql`
  mutation DeleteStepMutation($id: String!) {
    deleteStep(id: $id) {
      id
    }
  }
`

interface Props {
  step: NonNullable<FindStepById['step']>
}

const Step = ({ step }: Props) => {
  const [deleteStep] = useMutation(DELETE_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('Step deleted')
      navigate(routes.steps())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteStepMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete step ' + id + '?')) {
      deleteStep({ variables: { id } })
    }
  }

  const scripts = step.ScriptStep

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Step {step.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{step.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{step.name}</td>
            </tr>
            <tr>
              <th>Location</th>
              <td>{step.Location.name}</td>
            </tr>
            <tr>
              <th>Scénario</th>
              <td>
                {scripts.map((script) => (
                  <div key={script.Script.id}>
                    {script.Script.name} - {script.lettre}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editStep({ id: step.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(step.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Step
