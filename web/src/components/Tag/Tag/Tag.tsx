import type {
  DeleteTagMutation,
  DeleteTagMutationVariables,
  FindTagById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_TAG_MUTATION: TypedDocumentNode<
  DeleteTagMutation,
  DeleteTagMutationVariables
> = gql`
  mutation DeleteTagMutation($id: String!) {
    deleteTag(id: $id) {
      id
    }
  }
`

interface Props {
  tag: NonNullable<FindTagById['tag']>
}

const Tag = ({ tag }: Props) => {
  const [deleteTag] = useMutation(DELETE_TAG_MUTATION, {
    onCompleted: () => {
      toast.success('Tag deleted')
      navigate(routes.tags())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTagMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete tag ' + id + '?')) {
      deleteTag({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Tag {tag.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{tag.id}</td>
            </tr>
            <tr>
              <th>Titre</th>
              <td>{tag.titre}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTag({ id: tag.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(tag.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Tag
