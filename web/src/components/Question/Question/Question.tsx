import type {
  DeleteQuestionMutation,
  DeleteQuestionMutationVariables,
  FindQuestionById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_QUESTION_MUTATION: TypedDocumentNode<
  DeleteQuestionMutation,
  DeleteQuestionMutationVariables
> = gql`
  mutation DeleteQuestionMutation($id: String!) {
    deleteQuestion(id: $id) {
      id
    }
  }
`

interface Props {
  question: NonNullable<FindQuestionById['question']>
}

const Question = ({ question }: Props) => {
  const [deleteQuestion] = useMutation(DELETE_QUESTION_MUTATION, {
    onCompleted: () => {
      toast.success('Question deleted')
      navigate(routes.questions())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteQuestionMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete question ' + id + '?')) {
      deleteQuestion({ variables: { id } })
    }
  }

  const answers = question.Answer

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Question {question.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{question.id}</td>
            </tr>
            <tr>
              <th>Question</th>
              <td>{question.question}</td>
            </tr>
            <tr>
              <th>Réponse</th>
              <td>
                {answers.map((answer) => (
                  <div key={answer.id}>
                    <p>{answer.description}</p>
                    <p>{answer.answer}</p>
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{question.description}</td>
            </tr>
            <tr>
              <th>Question type</th>
              <td>{question.QuestionType.type}</td>
            </tr>
            <tr>
              <th>Step</th>
              <td>{question.Step.name}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editQuestion({ id: question.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(question.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Question
