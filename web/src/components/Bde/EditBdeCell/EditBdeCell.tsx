import type {
  EditBdeById,
  UpdateBdeInput,
  UpdateBdeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import BdeForm from 'src/components/Bde/BdeForm'

export const QUERY: TypedDocumentNode<EditBdeById> = gql`
  query EditBdeById($id: String!) {
    bde: bde(id: $id) {
      id
      name
      description
      logo
      departmentId
    }
  }
`

const UPDATE_BDE_MUTATION: TypedDocumentNode<
  EditBdeById,
  UpdateBdeMutationVariables
> = gql`
  mutation UpdateBdeMutation($id: String!, $input: UpdateBdeInput!) {
    updateBde(id: $id, input: $input) {
      id
      name
      description
      logo
      departmentId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ bde }: CellSuccessProps<EditBdeById>) => {
  const [updateBde, { loading, error }] = useMutation(UPDATE_BDE_MUTATION, {
    onCompleted: () => {
      toast.success('Bde updated')
      navigate(routes.bdes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: UpdateBdeInput, id: EditBdeById['bde']['id']) => {
    updateBde({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Bde {bde?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <BdeForm bde={bde} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
