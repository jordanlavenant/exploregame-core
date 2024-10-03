import type { FindScenarios, FindScenariosVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Scenarios from 'src/components/Scenario/Scenarios'

export const QUERY: TypedDocumentNode<FindScenarios, FindScenariosVariables> =
  gql`
    query FindScenarios {
      scenarios {
        id
        scenario
        description
        word
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No scenarios yet.{' '}
      <Link to={routes.newScenario()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindScenarios>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  scenarios,
}: CellSuccessProps<FindScenarios, FindScenariosVariables>) => {
  return <Scenarios scenarios={scenarios} />
}
