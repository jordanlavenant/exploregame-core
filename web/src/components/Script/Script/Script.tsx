import type {
  DeleteScriptMutation,
  DeleteScriptMutationVariables,
  FindScriptById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { checkboxInputTag } from 'src/lib/formatters'

const DELETE_SCRIPT_MUTATION: TypedDocumentNode<
  DeleteScriptMutation,
  DeleteScriptMutationVariables
> = gql`
  mutation DeleteScriptMutation($id: String!) {
    deleteScript(id: $id) {
      id
    }
  }
`

interface Props {
  script: NonNullable<FindScriptById['script']>
}

const Script = ({ script }: Props) => {
  const [deleteScript] = useMutation(DELETE_SCRIPT_MUTATION, {
    onCompleted: () => {
      toast.success('Script deleted')
      navigate(routes.scripts())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteScriptMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete script ' + id + '?')) {
      deleteScript({ variables: { id } })
    }
  }

  const steps = script.ScriptStep

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Script {script.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{script.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{script.name}</td>
            </tr>
            <tr>
              <th>Visible</th>
              <td>{checkboxInputTag(script.visible)}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{script.Department.name}</td>
            </tr>
            <tr>
              <th>Etape</th>
              <td>
                {steps.map((step) => (
                  <div key={step.Step.id}>
                    {step.Step.name} - {step.lettre}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editScript({ id: script.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(script.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Script
