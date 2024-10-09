import type { FindSteps, FindStepsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Steps from 'src/components/Step/Steps'

export const QUERY: TypedDocumentNode<FindSteps, FindStepsVariables> = gql`
  query FindSteps {
    steps {
      id
      name
      Location {
        id
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No steps yet.{' '}
      <Link to={routes.newStep()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindSteps>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  steps,
}: CellSuccessProps<FindSteps, FindStepsVariables>) => {
  return <Steps steps={steps} />
}
