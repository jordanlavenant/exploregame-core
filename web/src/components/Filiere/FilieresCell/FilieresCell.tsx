import type { FindFilieres, FindFilieresVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Filieres from 'src/components/Filiere/Filieres'

export const QUERY: TypedDocumentNode<FindFilieres, FindFilieresVariables> =
  gql`
    query FindFilieres {
      filieres {
        idF
        nomF
        descriptionF
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No filieres yet.{' '}
      <Link to={routes.newFiliere()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindFilieres>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  filieres,
}: CellSuccessProps<FindFilieres, FindFilieresVariables>) => {
  return <Filieres filieres={filieres} />
}
