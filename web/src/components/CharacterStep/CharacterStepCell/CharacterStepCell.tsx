import type {
  FindCharacterStepById,
  FindCharacterStepByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import CharacterStep from 'src/components/CharacterStep/CharacterStep'

export const QUERY: TypedDocumentNode<
  FindCharacterStepById,
  FindCharacterStepByIdVariables
> = gql`
  query FindCharacterStepById($id: String!) {
    characterStep: characterStep(id: $id) {
      id
      characterId
      stepId
      text
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>CharacterStep not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindCharacterStepByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  characterStep,
}: CellSuccessProps<FindCharacterStepById, FindCharacterStepByIdVariables>) => {
  return <CharacterStep characterStep={characterStep} />
}
