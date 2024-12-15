import EditAssetCell from 'src/components/Asset/EditAssetCell'

type AssetPageProps = {
  id: string
}

const EditAssetPage = ({ id }: AssetPageProps) => {
  return <EditAssetCell id={id} />
}

export default EditAssetPage
