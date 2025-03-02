import type {
  EditCharacterStepById,
  UpdateCharacterStepInput,
  UpdateCharacterStepMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from "sonner"

import CharacterStepForm from 'src/components/CharacterStep/CharacterStepForm'

export const QUERY: TypedDocumentNode<EditCharacterStepById> = gql`
  query EditCharacterStepById($id: String!) {
    characterStep: characterStep(id: $id) {
      id
      characterId
      stepId
      text
    }
  }
`

const UPDATE_CHARACTER_STEP_MUTATION: TypedDocumentNode<
  EditCharacterStepById,
  UpdateCharacterStepMutationVariables
> = gql`
  mutation UpdateCharacterStepMutation(
    $id: String!
    $input: UpdateCharacterStepInput!
  ) {
    updateCharacterStep(id: $id, input: $input) {
      id
      characterId
      stepId
      text
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  characterStep,
}: CellSuccessProps<EditCharacterStepById>) => {
  const [updateCharacterStep, { loading, error }] = useMutation(
    UPDATE_CHARACTER_STEP_MUTATION,
    {
      onCompleted: () => {
        toast.success('CharacterStep updated')
        navigate(routes.characterSteps())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateCharacterStepInput,
    id: EditCharacterStepById['characterStep']['id']
  ) => {
    updateCharacterStep({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit CharacterStep {characterStep?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <CharacterStepForm
          characterStep={characterStep}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
