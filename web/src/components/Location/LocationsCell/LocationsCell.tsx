import type { FindLocations, FindLocationsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Locations from 'src/components/Location/Locations'

export const QUERY: TypedDocumentNode<FindLocations, FindLocationsVariables> =
  gql`
    query FindLocations {
      locations {
        id
        name
        description
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No locations yet.{' '}
      <Link to={routes.newLocation()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindLocations>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  locations,
}: CellSuccessProps<FindLocations, FindLocationsVariables>) => {
  return <Locations locations={locations} />
}
