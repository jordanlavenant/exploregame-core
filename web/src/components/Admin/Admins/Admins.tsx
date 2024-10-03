import type {
  DeleteAdminMutation,
  DeleteAdminMutationVariables,
  FindAdmins,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Admin/AdminsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_ADMIN_MUTATION: TypedDocumentNode<
  DeleteAdminMutation,
  DeleteAdminMutationVariables
> = gql`
  mutation DeleteAdminMutation($id: String!) {
    deleteAdmin(id: $id) {
      id
    }
  }
`

const AdminsList = ({ admins }: FindAdmins) => {
  const [deleteAdmin] = useMutation(DELETE_ADMIN_MUTATION, {
    onCompleted: () => {
      toast.success('Admin deleted')
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

  const onDeleteClick = (id: DeleteAdminMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete admin ' + id + '?')) {
      deleteAdmin({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Role</th>
            <th>Id u</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{truncate(admin.id)}</td>
              <td>{truncate(admin.role)}</td>
              <td>{truncate(admin.idU)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.admin({ id: admin.id })}
                    title={'Show admin ' + admin.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editAdmin({ id: admin.id })}
                    title={'Edit admin ' + admin.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete admin ' + admin.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(admin.id)}
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

export default AdminsList
