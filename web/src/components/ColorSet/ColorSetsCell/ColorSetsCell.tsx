import type { FindColorSets, FindColorSetsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import ColorSets from 'src/components/ColorSet/ColorSets'

export const QUERY: TypedDocumentNode<FindColorSets, FindColorSetsVariables> =
  gql`
    query FindColorSets {
      colorSets {
        id
        primary
        secondary
        tertiary
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No colorSets yet.{' '}
      <Link to={routes.newColorSet()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindColorSets>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  colorSets,
}: CellSuccessProps<FindColorSets, FindColorSetsVariables>) => {
  return <ColorSets colorSets={colorSets} />
}
