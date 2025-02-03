import type { FindTags, FindTagsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Tags from 'src/components/Tag/Tags'

export const QUERY: TypedDocumentNode<FindTags, FindTagsVariables> = gql`
  query FindTags {
    tags {
      id
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No tags yet.{' '}
      <Link to={routes.newTag()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindTags>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  tags,
}: CellSuccessProps<FindTags, FindTagsVariables>) => {
  return <Tags tags={tags} />
}
