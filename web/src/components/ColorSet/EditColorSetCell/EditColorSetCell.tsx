import type {
  EditColorSetById,
  UpdateColorSetInput,
  UpdateColorSetMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "sonner"

import ColorSetForm from 'src/components/ColorSet/ColorSetForm'

export const QUERY: TypedDocumentNode<EditColorSetById> = gql`
  query EditColorSetById($id: String!) {
    colorSet: colorSet(id: $id) {
      id
      primary
      secondary
      tertiary
    }
  }
`

const UPDATE_COLOR_SET_MUTATION: TypedDocumentNode<
  EditColorSetById,
  UpdateColorSetMutationVariables
> = gql`
  mutation UpdateColorSetMutation($id: String!, $input: UpdateColorSetInput!) {
    updateColorSet(id: $id, input: $input) {
      id
      primary
      secondary
      tertiary
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ colorSet }: CellSuccessProps<EditColorSetById>) => {
  const [updateColorSet, { loading, error }] = useMutation(
    UPDATE_COLOR_SET_MUTATION,
    {
      onCompleted: () => {
        toast.success('ColorSet updated')
        navigate(routes.colorSets())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateColorSetInput,
    id: EditColorSetById['colorSet']['id']
  ) => {
    updateColorSet({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit ColorSet {colorSet?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ColorSetForm
          colorSet={colorSet}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
