import type {
  DeleteLocationMutation,
  DeleteLocationMutationVariables,
  FindLocationById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_LOCATION_MUTATION: TypedDocumentNode<
  DeleteLocationMutation,
  DeleteLocationMutationVariables
> = gql`
  mutation DeleteLocationMutation($id: String!) {
    deleteLocation(id: $id) {
      id
    }
  }
`

interface Props {
  location: NonNullable<FindLocationById['location']>
}

const Location = ({ location }: Props) => {
  const [deleteLocation] = useMutation(DELETE_LOCATION_MUTATION, {
    onCompleted: () => {
      toast.success('Location deleted')
      navigate(routes.locations())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteLocationMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete location ' + id + '?')) {
      deleteLocation({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Location {location.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{location.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{location.name}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{location.description}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editLocation({ id: location.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(location.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Location
