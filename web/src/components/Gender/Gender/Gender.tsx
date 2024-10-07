import type {
  DeleteGenderMutation,
  DeleteGenderMutationVariables,
  FindGenderById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

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

interface Props {
  gender: NonNullable<FindGenderById['gender']>
}

const Gender = ({ gender }: Props) => {
  const [deleteGender] = useMutation(DELETE_GENDER_MUTATION, {
    onCompleted: () => {
      toast.success('Gender deleted')
      navigate(routes.genders())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteGenderMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete gender ' + id + '?')) {
      deleteGender({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Gender {gender.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{gender.id}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{gender.gender}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editGender({ id: gender.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(gender.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Gender
