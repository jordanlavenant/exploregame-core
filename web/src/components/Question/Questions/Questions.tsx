import type {
  DeleteQuestionMutation,
  DeleteQuestionMutationVariables,
  FindQuestions,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Question/QuestionsCell'
import { truncate } from 'src/lib/formatters'

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

const QuestionsList = ({ questions }: FindQuestions) => {
  const [deleteQuestion] = useMutation(DELETE_QUESTION_MUTATION, {
    onCompleted: () => {
      toast.success('Question deleted')
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

  const onDeleteClick = (id: DeleteQuestionMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete question ' + id + '?')) {
      deleteQuestion({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Question</th>
            <th>Description</th>
            <th>Question type id</th>
            <th>Step id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{truncate(question.id)}</td>
              <td>{truncate(question.question)}</td>
              <td>{truncate(question.description)}</td>
              <td>{truncate(question.questionTypeId)}</td>
              <td>{truncate(question.stepId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.question({ id: question.id })}
                    title={'Show question ' + question.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editQuestion({ id: question.id })}
                    title={'Edit question ' + question.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete question ' + question.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(question.id)}
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

export default QuestionsList
