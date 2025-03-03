import type {
  EditNewsById,
  UpdateNewsInput,
  UpdateNewsMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "sonner"

import NewsForm from 'src/components/News/NewsForm'

export const QUERY: TypedDocumentNode<EditNewsById> = gql`
  query EditNewsById($id: String!) {
    news: news(id: $id) {
      id
      title
      description
      date
    }
  }
`

const UPDATE_NEWS_MUTATION: TypedDocumentNode<
  EditNewsById,
  UpdateNewsMutationVariables
> = gql`
  mutation UpdateNewsMutation($id: String!, $input: UpdateNewsInput!) {
    updateNews(id: $id, input: $input) {
      id
      title
      description
      date
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ news }: CellSuccessProps<EditNewsById>) => {
  const [updateNews, { loading, error }] = useMutation(UPDATE_NEWS_MUTATION, {
    onCompleted: () => {
      toast.success('News updated')
      navigate(routes.newses())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: UpdateNewsInput, id: EditNewsById['news']['id']) => {
    updateNews({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit News {news?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <NewsForm news={news} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
