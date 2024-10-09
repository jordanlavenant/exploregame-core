import type { FindStepById, FindStepByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Step from 'src/components/Step/Step'

export const QUERY: TypedDocumentNode<FindStepById, FindStepByIdVariables> =
  gql`
    query FindStepById($id: String!) {
      step: step(id: $id) {
        id
        name
        Location {
          id
          name
        }
        ScriptStep {
          Script {
            id
            name
          }
          lettre
        }
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Step not found</div>

export const Failure = ({ error }: CellFailureProps<FindStepByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  step,
}: CellSuccessProps<FindStepById, FindStepByIdVariables>) => {
  return <Step step={step} />
}
