import type { FindFiliereByIdF, FindFiliereByIdFVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Filiere from 'src/components/Filiere/Filiere'

export const QUERY: TypedDocumentNode<
  FindFiliereByIdF,
  FindFiliereByIdFVariables
> = gql`
  query FindFiliereByIdF($idF: String!) {
    filiere: filiere(idF: $idF) {
      idF
      nomF
      descriptionF
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Filiere not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindFiliereByIdFVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  filiere,
}: CellSuccessProps<FindFiliereByIdF, FindFiliereByIdFVariables>) => {
  return <Filiere filiere={filiere} />
}
