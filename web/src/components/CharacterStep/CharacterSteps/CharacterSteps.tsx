import type {
  DeleteCharacterStepMutation,
  DeleteCharacterStepMutationVariables,
  FindCharacterSteps,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/CharacterStep/CharacterStepsCell'
import { truncate } from 'src/lib/formatters'

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

const CharacterStepsList = ({ characterSteps }: FindCharacterSteps) => {
  const [deleteCharacterStep] = useMutation(DELETE_CHARACTER_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('CharacterStep deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteCharacterStepMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete characterStep ' + id + '?')) {
      deleteCharacterStep({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Character id</th>
            <th>Step id</th>
            <th>Text</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {characterSteps.map((characterStep) => (
            <tr key={characterStep.id}>
              <td>{truncate(characterStep.id)}</td>
              <td>{truncate(characterStep.characterId)}</td>
              <td>{truncate(characterStep.stepId)}</td>
              <td>{truncate(characterStep.text)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.characterStep({ id: characterStep.id })}
                    title={'Show characterStep ' + characterStep.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editCharacterStep({ id: characterStep.id })}
                    title={'Edit characterStep ' + characterStep.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete characterStep ' + characterStep.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(characterStep.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CharacterStepsList
