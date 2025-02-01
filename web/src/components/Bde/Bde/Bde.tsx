import type {
  DeleteBdeMutation,
  DeleteBdeMutationVariables,
  FindBdeById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

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

interface Props {
  bde: NonNullable<FindBdeById['bde']>
}

const Bde = ({ bde }: Props) => {
  const [deleteBde] = useMutation(DELETE_BDE_MUTATION, {
    onCompleted: () => {
      toast.success('Bde deleted')
      navigate(routes.bdes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteBdeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete bde ' + id + '?')) {
      deleteBde({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Bde {bde.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{bde.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{bde.name}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{bde.description}</td>
            </tr>
            <tr>
              <th>Logo</th>
              <td>{bde.logo}</td>
            </tr>
            <tr>
              <th>Department id</th>
              <td>{bde.departmentId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editBde({ id: bde.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(bde.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Bde
