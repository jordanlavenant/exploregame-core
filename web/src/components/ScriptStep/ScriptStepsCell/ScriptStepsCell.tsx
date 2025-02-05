import type { FindScriptSteps, FindScriptStepsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import ScriptSteps from 'src/components/ScriptStep/ScriptSteps'

export const QUERY: TypedDocumentNode<
  FindScriptSteps,
  FindScriptStepsVariables
> = gql`
  query FindScriptSteps {
    scriptSteps {
      id
      scriptId
      stepId
      lettre
      order
      Script {
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No scriptSteps yet.{' '}
      <Link to={routes.newScriptStep()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindScriptSteps>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  scriptSteps,
}: CellSuccessProps<FindScriptSteps, FindScriptStepsVariables>) => {
  return <ScriptSteps scriptSteps={scriptSteps} />
}
