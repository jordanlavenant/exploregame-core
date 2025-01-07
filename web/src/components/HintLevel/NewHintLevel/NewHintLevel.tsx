import type {
  CreateHintLevelMutation,
  CreateHintLevelInput,
  CreateHintLevelMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import HintLevelForm from 'src/components/HintLevel/HintLevelForm'

const CREATE_HINT_LEVEL_MUTATION: TypedDocumentNode<
  CreateHintLevelMutation,
  CreateHintLevelMutationVariables
> = gql`
  mutation CreateHintLevelMutation($input: CreateHintLevelInput!) {
    createHintLevel(input: $input) {
      id
    }
  }
`

const NewHintLevel = () => {
  const [createHintLevel, { loading, error }] = useMutation(
    CREATE_HINT_LEVEL_MUTATION,
    {
      onCompleted: () => {
        toast.success('HintLevel created')
        navigate(routes.hintLevels())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateHintLevelInput) => {
    createHintLevel({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New HintLevel</h2>
      </header>
      <div className="rw-segment-main">
        <HintLevelForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewHintLevel
