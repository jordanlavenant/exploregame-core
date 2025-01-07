import type {
  FindQuestionTypes,
  FindQuestionTypesVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import QuestionTypes from 'src/components/QuestionType/QuestionTypes'

export const QUERY: TypedDocumentNode<
  FindQuestionTypes,
  FindQuestionTypesVariables
> = gql`
  query FindQuestionTypes {
    questionTypes {
      id
      type
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No questionTypes yet.{' '}
      <Link to={routes.newQuestionType()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindQuestionTypes>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  questionTypes,
}: CellSuccessProps<FindQuestionTypes, FindQuestionTypesVariables>) => {
  return <QuestionTypes questionTypes={questionTypes} />
}
