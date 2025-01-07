import type { FindCharacters, FindCharactersVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Characters from 'src/components/Character/Characters'

export const QUERY: TypedDocumentNode<FindCharacters, FindCharactersVariables> =
  gql`
    query FindCharacters {
      characters {
        id
        nomPerso
        descriptionL
        image
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No characters yet.{' '}
      <Link to={routes.newCharacter()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindCharacters>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  characters,
}: CellSuccessProps<FindCharacters, FindCharactersVariables>) => {
  return <Characters characters={characters} />
}
