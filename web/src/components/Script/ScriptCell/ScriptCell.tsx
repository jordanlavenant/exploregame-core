import type { FindScriptById, FindScriptByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Script from 'src/components/Script/Script'

export const QUERY: TypedDocumentNode<FindScriptById, FindScriptByIdVariables> =
  gql`
    query FindScriptById($id: String!) {
      script: script(id: $id) {
        id
        name
        visible
        departmentId
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Script not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindScriptByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  script,
}: CellSuccessProps<FindScriptById, FindScriptByIdVariables>) => {
  return <Script script={script} />
}
