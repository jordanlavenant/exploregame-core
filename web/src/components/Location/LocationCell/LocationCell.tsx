import type { FindLocationById, FindLocationByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Location from 'src/components/Location/Location'

export const QUERY: TypedDocumentNode<
  FindLocationById,
  FindLocationByIdVariables
> = gql`
  query FindLocationById($id: String!) {
    location: location(id: $id) {
      id
      name
      description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Location not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindLocationByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  location,
}: CellSuccessProps<FindLocationById, FindLocationByIdVariables>) => {
  return <Location location={location} />
}
