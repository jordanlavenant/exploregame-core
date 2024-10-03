import type { FindPlayers, FindPlayersVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Players from 'src/components/Player/Players'

export const QUERY: TypedDocumentNode<FindPlayers, FindPlayersVariables> = gql`
  query FindPlayers {
    players {
      id
      gender
      idU
      idF
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No players yet.{' '}
      <Link to={routes.newPlayer()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindPlayers>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  players,
}: CellSuccessProps<FindPlayers, FindPlayersVariables>) => {
  return <Players players={players} />
}
