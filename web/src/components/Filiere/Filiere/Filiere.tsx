import type {
  DeleteFiliereMutation,
  DeleteFiliereMutationVariables,
  FindFiliereByIdF,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_FILIERE_MUTATION: TypedDocumentNode<
  DeleteFiliereMutation,
  DeleteFiliereMutationVariables
> = gql`
  mutation DeleteFiliereMutation($idF: String!) {
    deleteFiliere(idF: $idF) {
      idF
    }
  }
`

interface Props {
  filiere: NonNullable<FindFiliereByIdF['filiere']>
}

const Filiere = ({ filiere }: Props) => {
  const [deleteFiliere] = useMutation(DELETE_FILIERE_MUTATION, {
    onCompleted: () => {
      toast.success('Filiere deleted')
      navigate(routes.filieres())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (idF: DeleteFiliereMutationVariables['idF']) => {
    if (confirm('Are you sure you want to delete filiere ' + idF + '?')) {
      deleteFiliere({ variables: { idF } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Filiere {filiere.idF} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id f</th>
              <td>{filiere.idF}</td>
            </tr>
            <tr>
              <th>Nom f</th>
              <td>{filiere.nomF}</td>
            </tr>
            <tr>
              <th>Description f</th>
              <td>{filiere.descriptionF}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editFiliere({ idF: filiere.idF })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(filiere.idF)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Filiere
