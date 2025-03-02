import type {
  EditTagById,
  UpdateTagInput,
  UpdateTagMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "sonner"

import TagForm from 'src/components/Tag/TagForm'

export const QUERY: TypedDocumentNode<EditTagById> = gql`
  query EditTagById($id: String!) {
    tag: tag(id: $id) {
      id
      titre
    }
  }
`

const UPDATE_TAG_MUTATION: TypedDocumentNode<
  EditTagById,
  UpdateTagMutationVariables
> = gql`
  mutation UpdateTagMutation($id: String!, $input: UpdateTagInput!) {
    updateTag(id: $id, input: $input) {
      id
      titre
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ tag }: CellSuccessProps<EditTagById>) => {
  const [updateTag, { loading, error }] = useMutation(UPDATE_TAG_MUTATION, {
    onCompleted: () => {
      toast.success('Tag updated')
      navigate(routes.tags())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: UpdateTagInput, id: EditTagById['tag']['id']) => {
    updateTag({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Tag {tag?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <TagForm tag={tag} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
