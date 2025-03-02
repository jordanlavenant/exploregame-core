import type {
  DeleteColorSetMutation,
  DeleteColorSetMutationVariables,
  FindColorSets,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { QUERY } from 'src/components/ColorSet/ColorSetsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_COLOR_SET_MUTATION: TypedDocumentNode<
  DeleteColorSetMutation,
  DeleteColorSetMutationVariables
> = gql`
  mutation DeleteColorSetMutation($id: String!) {
    deleteColorSet(id: $id) {
      id
    }
  }
`

const ColorSetsList = ({ colorSets }: FindColorSets) => {
  const [deleteColorSet] = useMutation(DELETE_COLOR_SET_MUTATION, {
    onCompleted: () => {
      toast.success('ColorSet deleted')
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

  const onDeleteClick = (id: DeleteColorSetMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete colorSet ' + id + '?')) {
      deleteColorSet({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Primary</th>
            <th>Secondary</th>
            <th>Tertiary</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {colorSets.map((colorSet) => (
            <tr key={colorSet.id}>
              <td>{truncate(colorSet.id)}</td>
              <td>{truncate(colorSet.primary)}</td>
              <td>{truncate(colorSet.secondary)}</td>
              <td>{truncate(colorSet.tertiary)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.colorSet({ id: colorSet.id })}
                    title={'Show colorSet ' + colorSet.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editColorSet({ id: colorSet.id })}
                    title={'Edit colorSet ' + colorSet.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete colorSet ' + colorSet.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(colorSet.id)}
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

export default ColorSetsList
