import type {
  DeleteColorSetMutation,
  DeleteColorSetMutationVariables,
  FindColorSetById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import {} from 'src/lib/formatters'

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

interface Props {
  colorSet: NonNullable<FindColorSetById['colorSet']>
}

const ColorSet = ({ colorSet }: Props) => {
  const [deleteColorSet] = useMutation(DELETE_COLOR_SET_MUTATION, {
    onCompleted: () => {
      toast.success('ColorSet deleted')
      navigate(routes.colorSets())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteColorSetMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete colorSet ' + id + '?')) {
      deleteColorSet({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            ColorSet {colorSet.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{colorSet.id}</td>
            </tr>
            <tr>
              <th>Primary</th>
              <td>{colorSet.primary}</td>
            </tr>
            <tr>
              <th>Secondary</th>
              <td>{colorSet.secondary}</td>
            </tr>
            <tr>
              <th>Tertiary</th>
              <td>{colorSet.tertiary}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editColorSet({ id: colorSet.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(colorSet.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default ColorSet
