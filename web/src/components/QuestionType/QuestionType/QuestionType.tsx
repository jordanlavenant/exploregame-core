import type {
  DeleteQuestionTypeMutation,
  DeleteQuestionTypeMutationVariables,
  FindQuestionTypeById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import {} from 'src/lib/formatters'

const DELETE_QUESTION_TYPE_MUTATION: TypedDocumentNode<
  DeleteQuestionTypeMutation,
  DeleteQuestionTypeMutationVariables
> = gql`
  mutation DeleteQuestionTypeMutation($id: String!) {
    deleteQuestionType(id: $id) {
      id
    }
  }
`

interface Props {
  questionType: NonNullable<FindQuestionTypeById['questionType']>
}

const QuestionType = ({ questionType }: Props) => {
  const [deleteQuestionType] = useMutation(DELETE_QUESTION_TYPE_MUTATION, {
    onCompleted: () => {
      toast.success('QuestionType deleted')
      navigate(routes.questionTypes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteQuestionTypeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete questionType ' + id + '?')) {
      deleteQuestionType({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            QuestionType {questionType.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{questionType.id}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{questionType.type}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editQuestionType({ id: questionType.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(questionType.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default QuestionType
