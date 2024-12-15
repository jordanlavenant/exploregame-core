import type { FindAssetById, FindAssetByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Asset from 'src/components/Asset/Asset'

export const QUERY: TypedDocumentNode<FindAssetById, FindAssetByIdVariables> =
  gql`
    query FindAssetById($id: String!) {
      asset: asset(id: $id) {
        id
        filename
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Asset not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAssetByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  asset,
}: CellSuccessProps<FindAssetById, FindAssetByIdVariables>) => {
  return <Asset asset={asset} />
}
