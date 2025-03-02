import type {
  DeleteNewsMutation,
  DeleteNewsMutationVariables,
  FindNewses,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { QUERY } from 'src/components/News/NewsesCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const NewsesList = ({ newses }: FindNewses) => {
  const [deleteNews] = useMutation(DELETE_NEWS_MUTATION, {
    onCompleted: () => {
      toast.success('News deleted')
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

  const onDeleteClick = (id: DeleteNewsMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete news ' + id + '?')) {
      deleteNews({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Date</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {newses.map((news) => (
            <tr key={news.id}>
              <td>{truncate(news.id)}</td>
              <td>{truncate(news.titre)}</td>
              <td>{truncate(news.description)}</td>
              <td>{timeTag(news.date)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.news({ id: news.id })}
                    title={'Show news ' + news.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editNews({ id: news.id })}
                    title={'Edit news ' + news.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete news ' + news.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(news.id)}
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

export default NewsesList
