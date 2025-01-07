import type {
  FindCharacterById,
  FindCharacterByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Character from 'src/components/Character/Character'

export const QUERY: TypedDocumentNode<
  FindCharacterById,
  FindCharacterByIdVariables
> = gql`
  query FindCharacterById($id: String!) {
    character: character(id: $id) {
      id
      nomPerso
      descriptionL
      image
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Character not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindCharacterByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  character,
}: CellSuccessProps<FindCharacterById, FindCharacterByIdVariables>) => {
  return <Character character={character} />
}
