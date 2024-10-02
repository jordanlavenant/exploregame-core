import type {
  DeleteFiliereMutation,
  DeleteFiliereMutationVariables,
  FindFilieres,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Filiere/FilieresCell'
import { truncate } from 'src/lib/formatters'

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

const FilieresList = ({ filieres }: FindFilieres) => {
  const [deleteFiliere] = useMutation(DELETE_FILIERE_MUTATION, {
    onCompleted: () => {
      toast.success('Filiere deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (idF: DeleteFiliereMutationVariables['idF']) => {
    if (confirm('Are you sure you want to delete filiere ' + idF + '?')) {
      deleteFiliere({ variables: { idF } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id f</th>
            <th>Nom f</th>
            <th>Description f</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {filieres.map((filiere) => (
            <tr key={filiere.idF}>
              <td>{truncate(filiere.idF)}</td>
              <td>{truncate(filiere.nomF)}</td>
              <td>{truncate(filiere.descriptionF)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.filiere({ idF: filiere.idF })}
                    title={'Show filiere ' + filiere.idF + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editFiliere({ idF: filiere.idF })}
                    title={'Edit filiere ' + filiere.idF}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete filiere ' + filiere.idF}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(filiere.idF)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FilieresList
