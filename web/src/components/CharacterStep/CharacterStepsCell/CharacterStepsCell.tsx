import type {
  FindCharacterSteps,
  FindCharacterStepsVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import CharacterSteps from 'src/components/CharacterStep/CharacterSteps'

export const QUERY: TypedDocumentNode<
  FindCharacterSteps,
  FindCharacterStepsVariables
> = gql`
  query FindCharacterSteps {
    characterSteps {
      id
      characterId
      stepId
      textOrder
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No characterSteps yet.{' '}
      <Link to={routes.newCharacterStep()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindCharacterSteps>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  characterSteps,
}: CellSuccessProps<FindCharacterSteps, FindCharacterStepsVariables>) => {
  return <CharacterSteps characterSteps={characterSteps} />
}
