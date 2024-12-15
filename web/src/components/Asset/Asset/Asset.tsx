import type {
  DeleteAssetMutation,
  DeleteAssetMutationVariables,
  FindAssetById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_ASSET_MUTATION: TypedDocumentNode<
  DeleteAssetMutation,
  DeleteAssetMutationVariables
> = gql`
  mutation DeleteAssetMutation($id: String!) {
    deleteAsset(id: $id) {
      id
    }
  }
`

interface Props {
  asset: NonNullable<FindAssetById['asset']>
}

const Asset = ({ asset }: Props) => {
  const [deleteAsset] = useMutation(DELETE_ASSET_MUTATION, {
    onCompleted: () => {
      toast.success('Asset deleted')
      navigate(routes.assets())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteAssetMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete asset ' + id + '?')) {
      deleteAsset({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Asset {asset.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{asset.id}</td>
            </tr>
            <tr>
              <th>Filename</th>
              <td>{asset.filename}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editAsset({ id: asset.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(asset.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Asset
