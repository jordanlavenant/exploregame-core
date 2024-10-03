import type {
  DeleteHintMutation,
  DeleteHintMutationVariables,
  FindHints,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Hint/HintsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_HINT_MUTATION: TypedDocumentNode<
  DeleteHintMutation,
  DeleteHintMutationVariables
> = gql`
  mutation DeleteHintMutation($id: String!) {
    deleteHint(id: $id) {
      id
    }
  }
`

const HintsList = ({ hints }: FindHints) => {
  const [deleteHint] = useMutation(DELETE_HINT_MUTATION, {
    onCompleted: () => {
      toast.success('Hint deleted')
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

  const onDeleteClick = (id: DeleteHintMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete hint ' + id + '?')) {
      deleteHint({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Hint</th>
            <th>Help</th>
            <th>Id q</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {hints.map((hint) => (
            <tr key={hint.id}>
              <td>{truncate(hint.id)}</td>
              <td>{truncate(hint.hint)}</td>
              <td>{truncate(hint.help)}</td>
              <td>{truncate(hint.idQ)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.hint({ id: hint.id })}
                    title={'Show hint ' + hint.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editHint({ id: hint.id })}
                    title={'Edit hint ' + hint.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete hint ' + hint.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(hint.id)}
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

export default HintsList
