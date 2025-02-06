import type {
  DeleteScriptMutation,
  DeleteScriptMutationVariables,
  FindScripts,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Script/ScriptsCell'
import { checkboxInputTag, truncate } from 'src/lib/formatters'

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

const ScriptsList = ({ scripts }: FindScripts) => {
  const [deleteScript] = useMutation(DELETE_SCRIPT_MUTATION, {
    onCompleted: () => {
      toast.success('Script deleted')
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

  const onDeleteClick = (id: DeleteScriptMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete script ' + id + '?')) {
      deleteScript({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Visible</th>
            <th>Department</th>
            <th>Mot secret</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {scripts.map((script) => (
            <tr key={script.id}>
              <td>{truncate(script.name)}</td>
              <td>{checkboxInputTag(script.visible)}</td>
              <td>{truncate(script.Department.name)}</td>
              <td>
                {script.ScriptStep.reduce((acc, step) => acc + step.lettre, '')}
              </td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.script({ id: script.id })}
                    title={'Show script ' + script.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editScript({ id: script.id })}
                    title={'Edit script ' + script.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete script ' + script.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(script.id)}
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

export default ScriptsList
