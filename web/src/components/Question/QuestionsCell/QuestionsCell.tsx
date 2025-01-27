import type { FindQuestions, FindQuestionsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Questions from 'src/components/Question/Questions'

export const QUERY: TypedDocumentNode<FindQuestions, FindQuestionsVariables> =
  gql`
    query FindQuestions {
      questions {
        id
        question
        description
        questionTypeId
        stepId
        order
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No questions yet.{' '}
      <Link to={routes.newQuestion()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindQuestions>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  questions,
}: CellSuccessProps<FindQuestions, FindQuestionsVariables>) => {
  return <Questions questions={questions} />
}
