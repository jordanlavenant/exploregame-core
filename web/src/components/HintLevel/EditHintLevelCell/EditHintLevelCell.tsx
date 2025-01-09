import type {
  EditHintLevelById,
  UpdateHintLevelInput,
  UpdateHintLevelMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import HintLevelForm from 'src/components/HintLevel/HintLevelForm'

export const QUERY: TypedDocumentNode<EditHintLevelById> = gql`
  query EditHintLevelById($id: String!) {
    hintLevel: hintLevel(id: $id) {
      id
      type
    }
  }
`

const UPDATE_HINT_LEVEL_MUTATION: TypedDocumentNode<
  EditHintLevelById,
  UpdateHintLevelMutationVariables
> = gql`
  mutation UpdateHintLevelMutation(
    $id: String!
    $input: UpdateHintLevelInput!
  ) {
    updateHintLevel(id: $id, input: $input) {
      id
      type
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ hintLevel }: CellSuccessProps<EditHintLevelById>) => {
  const [updateHintLevel, { loading, error }] = useMutation(
    UPDATE_HINT_LEVEL_MUTATION,
    {
      onCompleted: () => {
        toast.success('HintLevel updated')
        navigate(routes.hintLevels())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateHintLevelInput,
    id: EditHintLevelById['hintLevel']['id']
  ) => {
    updateHintLevel({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit HintLevel {hintLevel?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <HintLevelForm
          hintLevel={hintLevel}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
