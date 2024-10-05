import type {
  DeleteStatusMutation,
  DeleteStatusMutationVariables,
  FindStatusById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_STATUS_MUTATION: TypedDocumentNode<
  DeleteStatusMutation,
  DeleteStatusMutationVariables
> = gql`
  mutation DeleteStatusMutation($id: String!) {
    deleteStatus(id: $id) {
      id
    }
  }
`

interface Props {
  status: NonNullable<FindStatusById['status']>
}

const Status = ({ status }: Props) => {
  const [deleteStatus] = useMutation(DELETE_STATUS_MUTATION, {
    onCompleted: () => {
      toast.success('Status deleted')
      navigate(routes.statuses())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteStatusMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete status ' + id + '?')) {
      deleteStatus({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Status {status.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{status.id}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{status.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editStatus({ id: status.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(status.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Status
