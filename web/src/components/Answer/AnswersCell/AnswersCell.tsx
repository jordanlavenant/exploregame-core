import type { FindAnswers, FindAnswersVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Answers from 'src/components/Answer/Answers'

export const QUERY: TypedDocumentNode<FindAnswers, FindAnswersVariables> = gql`
  query FindAnswers {
    answers {
      id
      answer
      description
      questionId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No answers yet.{' '}
      <Link to={routes.newAnswer()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindAnswers>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  answers,
}: CellSuccessProps<FindAnswers, FindAnswersVariables>) => {
  return <Answers answers={answers} />
}
