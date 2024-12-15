import type { FindAssets, FindAssetsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Assets from 'src/components/Asset/Assets'

export const QUERY: TypedDocumentNode<FindAssets, FindAssetsVariables> = gql`
  query FindAssets {
    assets {
      id
      filename
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No assets yet.{' '}
      <Link to={routes.newAsset()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindAssets>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  assets,
}: CellSuccessProps<FindAssets, FindAssetsVariables>) => {
  return <Assets assets={assets} />
}
