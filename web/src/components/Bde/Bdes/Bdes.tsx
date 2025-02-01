import type {
  DeleteBdeMutation,
  DeleteBdeMutationVariables,
  FindBdes,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Bde/BdesCell'
import { truncate } from 'src/lib/formatters'

const DELETE_BDE_MUTATION: TypedDocumentNode<
  DeleteBdeMutation,
  DeleteBdeMutationVariables
> = gql`
  mutation DeleteBdeMutation($id: String!) {
    deleteBde(id: $id) {
      id
    }
  }
`

const BdesList = ({ bdes }: FindBdes) => {
  const [deleteBde] = useMutation(DELETE_BDE_MUTATION, {
    onCompleted: () => {
      toast.success('Bde deleted')
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

  const onDeleteClick = (id: DeleteBdeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete bde ' + id + '?')) {
      deleteBde({ variables: { id } })
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
            <th>Logo</th>
            <th>Department id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {bdes.map((bde) => (
            <tr key={bde.id}>
              <td>{truncate(bde.id)}</td>
              <td>{truncate(bde.name)}</td>
              <td>{truncate(bde.description)}</td>
              <td>{truncate(bde.logo)}</td>
              <td>{truncate(bde.departmentId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.bde({ id: bde.id })}
                    title={'Show bde ' + bde.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editBde({ id: bde.id })}
                    title={'Edit bde ' + bde.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete bde ' + bde.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(bde.id)}
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

export default BdesList
