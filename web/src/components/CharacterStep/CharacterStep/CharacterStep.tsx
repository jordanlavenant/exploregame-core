import type {
  DeleteCharacterStepMutation,
  DeleteCharacterStepMutationVariables,
  FindCharacterStepById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_CHARACTER_STEP_MUTATION: TypedDocumentNode<
  DeleteCharacterStepMutation,
  DeleteCharacterStepMutationVariables
> = gql`
  mutation DeleteCharacterStepMutation($id: String!) {
    deleteCharacterStep(id: $id) {
      id
    }
  }
`

interface Props {
  characterStep: NonNullable<FindCharacterStepById['characterStep']>
}

const CharacterStep = ({ characterStep }: Props) => {
  const [deleteCharacterStep] = useMutation(DELETE_CHARACTER_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('CharacterStep deleted')
      navigate(routes.characterSteps())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteCharacterStepMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete characterStep ' + id + '?')) {
      deleteCharacterStep({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            CharacterStep {characterStep.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{characterStep.id}</td>
            </tr>
            <tr>
              <th>Character id</th>
              <td>{characterStep.characterId}</td>
            </tr>
            <tr>
              <th>Step id</th>
              <td>{characterStep.stepId}</td>
            </tr>
            <tr>
              <th>Text order</th>
              <td>{characterStep.textOrder}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editCharacterStep({ id: characterStep.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(characterStep.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default CharacterStep
