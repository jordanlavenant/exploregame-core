import type {
  EditFiliereByIdF,
  UpdateFiliereInput,
  UpdateFiliereMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FiliereForm from 'src/components/Filiere/FiliereForm'

export const QUERY: TypedDocumentNode<EditFiliereByIdF> = gql`
  query EditFiliereByIdF($idF: String!) {
    filiere: filiere(idF: $idF) {
      idF
      nomF
      descriptionF
    }
  }
`

const UPDATE_FILIERE_MUTATION: TypedDocumentNode<
  EditFiliereById,
  UpdateFiliereMutationVariables
> = gql`
  mutation UpdateFiliereMutation($idF: String!, $input: UpdateFiliereInput!) {
    updateFiliere(idF: $idF, input: $input) {
      idF
      nomF
      descriptionF
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ filiere }: CellSuccessProps<EditFiliereByIdF>) => {
  const [updateFiliere, { loading, error }] = useMutation(
    UPDATE_FILIERE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Filiere updated')
        navigate(routes.filieres())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateFiliereInput,
    id: EditFiliereByIdF['filiere']['id']
  ) => {
    updateFiliere({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Filiere {filiere?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <FiliereForm
          filiere={filiere}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
