import type {
  EditHintById,
  UpdateHintInput,
  UpdateHintMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import HintForm from 'src/components/Hint/HintForm'

export const QUERY: TypedDocumentNode<EditHintById> = gql`
  query EditHintById($id: String!) {
    hint: hint(id: $id) {
      id
      hint
      help
      idQ
    }
  }
`

const UPDATE_HINT_MUTATION: TypedDocumentNode<
  EditHintById,
  UpdateHintMutationVariables
> = gql`
  mutation UpdateHintMutation($id: String!, $input: UpdateHintInput!) {
    updateHint(id: $id, input: $input) {
      id
      hint
      help
      idQ
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ hint }: CellSuccessProps<EditHintById>) => {
  const [updateHint, { loading, error }] = useMutation(UPDATE_HINT_MUTATION, {
    onCompleted: () => {
      toast.success('Hint updated')
      navigate(routes.hints())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: UpdateHintInput, id: EditHintById['hint']['id']) => {
    updateHint({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Hint {hint?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <HintForm hint={hint} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
