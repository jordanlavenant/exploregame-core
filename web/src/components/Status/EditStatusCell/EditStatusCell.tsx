import type {
  EditStatusById,
  UpdateStatusInput,
  UpdateStatusMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import StatusForm from 'src/components/Status/StatusForm'

export const QUERY: TypedDocumentNode<EditStatusById> = gql`
  query EditStatusById($id: String!) {
    status: status(id: $id) {
      id
      status
    }
  }
`

const UPDATE_STATUS_MUTATION: TypedDocumentNode<
  EditStatusById,
  UpdateStatusMutationVariables
> = gql`
  mutation UpdateStatusMutation($id: String!, $input: UpdateStatusInput!) {
    updateStatus(id: $id, input: $input) {
      id
      status
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ status }: CellSuccessProps<EditStatusById>) => {
  const [updateStatus, { loading, error }] = useMutation(
    UPDATE_STATUS_MUTATION,
    {
      onCompleted: () => {
        toast.success('Status updated')
        navigate(routes.statuses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateStatusInput,
    id: EditStatusById['status']['id']
  ) => {
    updateStatus({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Status {status?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <StatusForm
          status={status}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
