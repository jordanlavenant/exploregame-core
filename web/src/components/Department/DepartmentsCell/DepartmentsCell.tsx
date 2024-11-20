import type { FindDepartments, FindDepartmentsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Departments from 'src/components/Department/Departments'

export const QUERY: TypedDocumentNode<
  FindDepartments,
  FindDepartmentsVariables
> = gql`
  query FindDepartments {
    departments {
      id
      name
      description
      colorSetId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No departments yet.{' '}
      <Link to={routes.newDepartment()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindDepartments>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  departments,
}: CellSuccessProps<FindDepartments, FindDepartmentsVariables>) => {
  return <Departments departments={departments} />
}
