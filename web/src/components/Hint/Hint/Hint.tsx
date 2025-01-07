import type {
  DeleteHintMutation,
  DeleteHintMutationVariables,
  FindHintById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_HINT_MUTATION: TypedDocumentNode<
  DeleteHintMutation,
  DeleteHintMutationVariables
> = gql`
  mutation DeleteHintMutation($id: String!) {
    deleteHint(id: $id) {
      id
    }
  }
`

interface Props {
  hint: NonNullable<FindHintById['hint']>
}

const Hint = ({ hint }: Props) => {
  const [deleteHint] = useMutation(DELETE_HINT_MUTATION, {
    onCompleted: () => {
      toast.success('Hint deleted')
      navigate(routes.hints())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteHintMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete hint ' + id + '?')) {
      deleteHint({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Hint {hint.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{hint.id}</td>
            </tr>
            <tr>
              <th>Help</th>
              <td>{hint.help}</td>
            </tr>
            <tr>
              <th>Question id</th>
              <td>{hint.questionId}</td>
            </tr>
            <tr>
              <th>Hint level id</th>
              <td>{hint.hintLevelId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editHint({ id: hint.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(hint.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Hint
