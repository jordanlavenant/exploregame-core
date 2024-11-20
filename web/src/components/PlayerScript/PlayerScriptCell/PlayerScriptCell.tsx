import type {
  FindPlayerScriptById,
  FindPlayerScriptByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import PlayerScript from 'src/components/PlayerScript/PlayerScript'

export const QUERY: TypedDocumentNode<
  FindPlayerScriptById,
  FindPlayerScriptByIdVariables
> = gql`
  query FindPlayerScriptById($id: String!) {
    playerScript: playerScript(id: $id) {
      id
      playerId
      scriptId
      stepId
      score
      remainingTime
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>PlayerScript not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindPlayerScriptByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  playerScript,
}: CellSuccessProps<FindPlayerScriptById, FindPlayerScriptByIdVariables>) => {
  return <PlayerScript playerScript={playerScript} />
}
