import type {
  DeleteAnswerMutation,
  DeleteAnswerMutationVariables,
  FindAnswerById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag } from 'src/lib/formatters'

const DELETE_ANSWER_MUTATION: TypedDocumentNode<
  DeleteAnswerMutation,
  DeleteAnswerMutationVariables
> = gql`
  mutation DeleteAnswerMutation($id: String!) {
    deleteAnswer(id: $id) {
      id
    }
  }
`

interface Props {
  answer: NonNullable<FindAnswerById['answer']>
}

const Answer = ({ answer }: Props) => {
  const [deleteAnswer] = useMutation(DELETE_ANSWER_MUTATION, {
    onCompleted: () => {
      toast.success('Answer deleted')
      navigate(routes.answers())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteAnswerMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete answer ' + id + '?')) {
      deleteAnswer({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Answer {answer.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{answer.id}</td>
            </tr>
            <tr>
              <th>Answer</th>
              <td>{answer.answer}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{answer.description}</td>
            </tr>
            <tr>
              <th>Question id</th>
              <td>{answer.questionId}</td>
            </tr>
            <tr>
              <th>Is correct</th>
              <td>{checkboxInputTag(answer.isCorrect)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editAnswer({ id: answer.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(answer.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Answer
