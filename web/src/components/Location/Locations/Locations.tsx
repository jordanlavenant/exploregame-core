import type {
  DeleteLocationMutation,
  DeleteLocationMutationVariables,
  FindLocations,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { QUERY } from 'src/components/Location/LocationsCell'
import { truncate } from 'src/lib/formatters'

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

const LocationsList = ({ locations }: FindLocations) => {
  const [deleteLocation] = useMutation(DELETE_LOCATION_MUTATION, {
    onCompleted: () => {
      toast.success('Location deleted')
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

  const onDeleteClick = (id: DeleteLocationMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete location ' + id + '?')) {
      deleteLocation({ variables: { id } })
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
          {locations.map((location) => (
            <tr key={location.id}>
              <td>{truncate(location.id)}</td>
              <td>{truncate(location.name)}</td>
              <td>{truncate(location.description)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.location({ id: location.id })}
                    title={'Show location ' + location.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editLocation({ id: location.id })}
                    title={'Edit location ' + location.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete location ' + location.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(location.id)}
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

export default LocationsList
