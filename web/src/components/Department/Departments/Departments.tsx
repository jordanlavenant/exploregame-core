import type {
  DeleteDepartmentMutation,
  DeleteDepartmentMutationVariables,
  FindDepartments,
  FindColorSets,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { QUERY as DEPARTMENTS_QUERY } from 'src/components/Department/DepartmentsCell'
import { QUERY as COLOR_SETS_QUERY } from 'src/components/ColorSet/ColorSetsCell'
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
  const { data: colorSetsData } = useQuery<FindColorSets>(COLOR_SETS_QUERY)
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Department deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: DEPARTMENTS_QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteDepartmentMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete department ' + id + '?')) {
      deleteDepartment({ variables: { id } })
    }
  }

  const getColorSet = (colorSetId: string) => {
    const colorSet = colorSetsData?.colorSets.find((set) => set.id === colorSetId)
    return colorSet ? colorSet : { primary: 'Unknown', secondary: 'Unknown', tertiary: 'Unknown' }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Couleur principale</th>
            <th>Couleur secondaire</th>
            <th>Couleur tertiaire</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => {
            const colorSet = getColorSet(department.colorSetId)
            return (
              <tr key={department.id}>
                <td>{truncate(department.name)}</td>
                <td>{truncate(department.description)}</td>
                <td>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: colorSet.primary,
                      border: '1px solid #000',
                    }}
                  ></div>
                </td>
                <td>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: colorSet.secondary,
                      border: '1px solid #000',
                    }}
                  ></div>
                </td>
                <td>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: colorSet.tertiary,
                      border: '1px solid #000',
                    }}
                  ></div>
                </td>
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default DepartmentsList