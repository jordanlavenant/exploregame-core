import type {
  FindDepartmentById,
  FindDepartmentByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Department from 'src/components/Department/Department'

export const QUERY: TypedDocumentNode<
  FindDepartmentById,
  FindDepartmentByIdVariables
> = gql`
  query FindDepartmentById($id: String!) {
    department: department(id: $id) {
      id
      name
      description
      colorSetId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Department not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindDepartmentByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  department,
}: CellSuccessProps<FindDepartmentById, FindDepartmentByIdVariables>) => {
  return <Department department={department} />
}
