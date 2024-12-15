import type {
  DeleteAssetMutation,
  DeleteAssetMutationVariables,
  FindAssets,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Asset/AssetsCell'
import { truncate } from 'src/lib/formatters'

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

const AssetsList = ({ assets }: FindAssets) => {
  const [deleteAsset] = useMutation(DELETE_ASSET_MUTATION, {
    onCompleted: () => {
      toast.success('Asset deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteAssetMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete asset ' + id + '?')) {
      deleteAsset({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Filename</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{truncate(asset.id)}</td>
              <td>{truncate(asset.filename)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.asset({ id: asset.id })}
                    title={'Show asset ' + asset.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editAsset({ id: asset.id })}
                    title={'Edit asset ' + asset.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete asset ' + asset.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(asset.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AssetsList
