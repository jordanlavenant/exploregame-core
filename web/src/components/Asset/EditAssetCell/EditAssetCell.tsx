import type {
  EditAssetById,
  UpdateAssetInput,
  UpdateAssetMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AssetForm from 'src/components/Asset/AssetForm'

export const QUERY: TypedDocumentNode<EditAssetById> = gql`
  query EditAssetById($id: String!) {
    asset: asset(id: $id) {
      id
      filename
    }
  }
`

const UPDATE_ASSET_MUTATION: TypedDocumentNode<
  EditAssetById,
  UpdateAssetMutationVariables
> = gql`
  mutation UpdateAssetMutation($id: String!, $input: UpdateAssetInput!) {
    updateAsset(id: $id, input: $input) {
      id
      filename
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ asset }: CellSuccessProps<EditAssetById>) => {
  const [updateAsset, { loading, error }] = useMutation(UPDATE_ASSET_MUTATION, {
    onCompleted: () => {
      toast.success('Asset updated')
      navigate(routes.assets())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (
    input: UpdateAssetInput,
    id: EditAssetById['asset']['id']
  ) => {
    updateAsset({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Asset {asset?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <AssetForm
          asset={asset}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
