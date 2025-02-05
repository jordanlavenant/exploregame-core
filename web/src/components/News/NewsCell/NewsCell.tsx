import type { FindNewsById, FindNewsByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import News from 'src/components/News/News'

export const QUERY: TypedDocumentNode<FindNewsById, FindNewsByIdVariables> =
  gql`
    query FindNewsById($id: String!) {
      news: news(id: $id) {
        id
        title
        description
        date
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>News not found</div>

export const Failure = ({ error }: CellFailureProps<FindNewsByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  news,
}: CellSuccessProps<FindNewsById, FindNewsByIdVariables>) => {
  return <News news={news} />
}
