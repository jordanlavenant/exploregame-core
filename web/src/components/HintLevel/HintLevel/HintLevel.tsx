import type {
  DeleteHintLevelMutation,
  DeleteHintLevelMutationVariables,
  FindHintLevelById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_HINT_LEVEL_MUTATION: TypedDocumentNode<
  DeleteHintLevelMutation,
  DeleteHintLevelMutationVariables
> = gql`
  mutation DeleteHintLevelMutation($id: String!) {
    deleteHintLevel(id: $id) {
      id
    }
  }
`

interface Props {
  hintLevel: NonNullable<FindHintLevelById['hintLevel']>
}

const HintLevel = ({ hintLevel }: Props) => {
  const [deleteHintLevel] = useMutation(DELETE_HINT_LEVEL_MUTATION, {
    onCompleted: () => {
      toast.success('HintLevel deleted')
      navigate(routes.hintLevels())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteHintLevelMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete hintLevel ' + id + '?')) {
      deleteHintLevel({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            HintLevel {hintLevel.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{hintLevel.id}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{hintLevel.type}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editHintLevel({ id: hintLevel.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(hintLevel.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default HintLevel
