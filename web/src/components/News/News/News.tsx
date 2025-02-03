import type {
  DeleteNewsMutation,
  DeleteNewsMutationVariables,
  FindNewsById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_NEWS_MUTATION: TypedDocumentNode<
  DeleteNewsMutation,
  DeleteNewsMutationVariables
> = gql`
  mutation DeleteNewsMutation($id: String!) {
    deleteNews(id: $id) {
      id
    }
  }
`

interface Props {
  news: NonNullable<FindNewsById['news']>
}

const News = ({ news }: Props) => {
  const [deleteNews] = useMutation(DELETE_NEWS_MUTATION, {
    onCompleted: () => {
      toast.success('News deleted')
      navigate(routes.newses())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteNewsMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete news ' + id + '?')) {
      deleteNews({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            News {news.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{news.id}</td>
            </tr>
            <tr>
              <th>Title</th>
              <td>{news.title}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{news.description}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{timeTag(news.date)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editNews({ id: news.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(news.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default News
