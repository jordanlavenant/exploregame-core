import { TypedDocumentNode, useMutation } from "@redwoodjs/web"
import { CreateAssetInput, CreateAssetVariables } from "types/graphql"

const CREATE_ASSET_MUTATION: TypedDocumentNode<
  CreateAssetInput,
  CreateAssetVariables
> = gql`
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
      id
      filename
    }
  }
`

const AssetUploader = () => {
  const [createAsset] = useMutation(CREATE_ASSET_MUTATION)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const file = files[0]
      const response = await createAsset({
        variables: {
          input: {
            filename: file.name,
          },
        },
      })

      console.log(response)
    }
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleUpload}
    />
  )

}

export default AssetUploader