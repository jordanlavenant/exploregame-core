import type {
  DeleteDepartmentMutation,
  DeleteDepartmentMutationVariables,
  FindDepartments,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Department/DepartmentsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_DEPARTMENT_MUTATION: TypedDocumentNode<
  DeleteDepartmentMutation,
  DeleteDepartmentMutationVariables
> = gql`
  mutation DeleteDepartmentMutation($id: String!) {
    deleteDepartment(id: $id) {
      id
    }
  }
`

const DepartmentsList = ({ departments }: FindDepartments) => {
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Department deleted')
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

  const onDeleteClick = (id: DeleteDepartmentMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete department ' + id + '?')) {
      deleteDepartment({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.id}>
              <td>{truncate(department.id)}</td>
              <td>{truncate(department.name)}</td>
              <td>{truncate(department.description)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.department({ id: department.id })}
                    title={'Show department ' + department.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editDepartment({ id: department.id })}
                    title={'Edit department ' + department.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete department ' + department.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(department.id)}
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

export default DepartmentsList
