import type {
  EditDepartmentById,
  UpdateDepartmentInput,
  UpdateDepartmentMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "sonner"

import DepartmentForm from 'src/components/Department/DepartmentForm'

export const QUERY: TypedDocumentNode<EditDepartmentById> = gql`
  query EditDepartmentById($id: String!) {
    department: department(id: $id) {
      id
      name
      description
      colorSetId
      latitude
      longitude
    }
  }
`

const UPDATE_DEPARTMENT_MUTATION: TypedDocumentNode<
  EditDepartmentById,
  UpdateDepartmentMutationVariables
> = gql`
  mutation UpdateDepartmentMutation(
    $id: String!
    $input: UpdateDepartmentInput!
  ) {
    updateDepartment(id: $id, input: $input) {
      id
      name
      description
      colorSetId
      latitude
      longitude
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  department,
}: CellSuccessProps<EditDepartmentById>) => {
  const [updateDepartment, { loading, error }] = useMutation(
    UPDATE_DEPARTMENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Department updated')
        navigate(routes.departments())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateDepartmentInput,
    id: EditDepartmentById['department']['id']
  ) => {
    updateDepartment({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Department {department?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <DepartmentForm
          department={department}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
