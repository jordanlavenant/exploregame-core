import type { FindTagById, FindTagByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Tag from 'src/components/Tag/Tag'

export const QUERY: TypedDocumentNode<FindTagById, FindTagByIdVariables> = gql`
  query FindTagById($id: String!) {
    tag: tag(id: $id) {
      id
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Tag not found</div>

export const Failure = ({ error }: CellFailureProps<FindTagByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  tag,
}: CellSuccessProps<FindTagById, FindTagByIdVariables>) => {
  return <Tag tag={tag} />
}
