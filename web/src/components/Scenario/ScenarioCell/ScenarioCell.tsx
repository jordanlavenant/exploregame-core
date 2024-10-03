import type { FindScenarioById, FindScenarioByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Scenario from 'src/components/Scenario/Scenario'

export const QUERY: TypedDocumentNode<
  FindScenarioById,
  FindScenarioByIdVariables
> = gql`
  query FindScenarioById($id: String!) {
    scenario: scenario(id: $id) {
      id
      scenario
      description
      word
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Scenario not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindScenarioByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  scenario,
}: CellSuccessProps<FindScenarioById, FindScenarioByIdVariables>) => {
  return <Scenario scenario={scenario} />
}
