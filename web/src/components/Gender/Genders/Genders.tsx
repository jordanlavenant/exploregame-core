import type {
  DeleteGenderMutation,
  DeleteGenderMutationVariables,
  FindGenders,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Gender/GendersCell'
import { truncate } from 'src/lib/formatters'

const DELETE_GENDER_MUTATION: TypedDocumentNode<
  DeleteGenderMutation,
  DeleteGenderMutationVariables
> = gql`
  mutation DeleteGenderMutation($id: String!) {
    deleteGender(id: $id) {
      id
    }
  }
`

const GendersList = ({ genders }: FindGenders) => {
  const [deleteGender] = useMutation(DELETE_GENDER_MUTATION, {
    onCompleted: () => {
      toast.success('Gender deleted')
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

  const onDeleteClick = (id: DeleteGenderMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete gender ' + id + '?')) {
      deleteGender({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Gender</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {genders.map((gender) => (
            <tr key={gender.id}>
              <td>{truncate(gender.id)}</td>
              <td>{truncate(gender.gender)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.gender({ id: gender.id })}
                    title={'Show gender ' + gender.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editGender({ id: gender.id })}
                    title={'Edit gender ' + gender.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete gender ' + gender.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(gender.id)}
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

export default GendersList
