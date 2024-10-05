import type {
  CreateStatusMutation,
  CreateStatusInput,
  CreateStatusMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import StatusForm from 'src/components/Status/StatusForm'

const CREATE_STATUS_MUTATION: TypedDocumentNode<
  CreateStatusMutation,
  CreateStatusMutationVariables
> = gql`
  mutation CreateStatusMutation($input: CreateStatusInput!) {
    createStatus(input: $input) {
      id
    }
  }
`

const NewStatus = () => {
  const [createStatus, { loading, error }] = useMutation(
    CREATE_STATUS_MUTATION,
    {
      onCompleted: () => {
        toast.success('Status created')
        navigate(routes.statuses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateStatusInput) => {
    createStatus({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Status</h2>
      </header>
      <div className="rw-segment-main">
        <StatusForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewStatus
