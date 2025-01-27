import type {
  FindScriptStepById,
  FindScriptStepByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import ScriptStep from 'src/components/ScriptStep/ScriptStep'

export const QUERY: TypedDocumentNode<
  FindScriptStepById,
  FindScriptStepByIdVariables
> = gql`
  query FindScriptStepById($id: String!) {
    scriptStep: scriptStep(id: $id) {
      id
      scriptId
      stepId
      lettre
      order
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>ScriptStep not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindScriptStepByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  scriptStep,
}: CellSuccessProps<FindScriptStepById, FindScriptStepByIdVariables>) => {
  return <ScriptStep scriptStep={scriptStep} />
}
