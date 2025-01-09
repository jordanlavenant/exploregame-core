import type {
  FindPlayerScripts,
  FindPlayerScriptsVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import PlayerScripts from 'src/components/PlayerScript/PlayerScripts'

export const QUERY: TypedDocumentNode<
  FindPlayerScripts,
  FindPlayerScriptsVariables
> = gql`
  query FindPlayerScripts {
    playerScripts {
      id
      playerId
      scriptId
      stepId
      questionId
      score
      remainingTime
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No playerScripts yet.{' '}
      <Link to={routes.newPlayerScript()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindPlayerScripts>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  playerScripts,
}: CellSuccessProps<FindPlayerScripts, FindPlayerScriptsVariables>) => {
  return <PlayerScripts playerScripts={playerScripts} />
}
