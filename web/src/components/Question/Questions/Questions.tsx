import type {
  DeleteQuestionMutation,
  DeleteQuestionMutationVariables,
  FindQuestions,
  UpdateQuestionMutation,
  UpdateQuestionMutationVariables,
  FindSteps,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY as QUESTIONS_QUERY } from 'src/components/Question/QuestionsCell'
import { QUERY as STEPS_QUERY } from 'src/components/Step/StepsCell'
import { truncate } from 'src/lib/formatters'

import { saveQuestions } from '@/utils/questions'

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

const UPDATE_QUESTION_MUTATION: TypedDocumentNode<
  UpdateQuestionMutation,
  UpdateQuestionMutationVariables
> = gql`
  mutation UpdateQuestionAfterDeletation(
    $id: String!
    $input: UpdateQuestionInput!
  ) {
    updateQuestion(id: $id, input: $input) {
      id
      order
    }
  }
`

const QuestionsList = ({ questions }: FindQuestions) => {
  const { data: stepsData } = useQuery<FindSteps>(STEPS_QUERY)
  const [updateQuestion] = useMutation(UPDATE_QUESTION_MUTATION)
  const [deleteQuestion] = useMutation(DELETE_QUESTION_MUTATION, {
    onCompleted: () => {
      toast.success('Question deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUESTIONS_QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteQuestionMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete question ' + id + '?')) {
      deleteQuestion({ variables: { id } }).then(() => {
        const question = questions.find((q) => q.id === id)
        const questionsSameStep = questions.filter(
          (q) => q.step.id === question?.step.id && q.id !== id
        )
        const newQuestions = []
        questionsSameStep.forEach((question, index) => {
          newQuestions.push({
            id: question.id,
            order: index,
          })
        })
        saveQuestions({
          currQuestions: newQuestions,
          updateQuestion,
        })
      })
    }
  }

  const getStepName = (stepId: string) => {
    const step = stepsData?.steps.find((step) => step.id === stepId)
    return step ? step.name : 'Unknown Step'
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Question type id</th>
            <th>Step</th>
            <th>Order</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{truncate(question.question)}</td>
              <td>{truncate(question.questionTypeId)}</td>
              <td>{truncate(getStepName(question.stepId))}</td>
              <td>{truncate(question.order)}</td>
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