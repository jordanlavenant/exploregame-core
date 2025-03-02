import type {
  DeleteHintLevelMutation,
  DeleteHintLevelMutationVariables,
  FindHintLevels,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { QUERY } from 'src/components/HintLevel/HintLevelsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_HINT_LEVEL_MUTATION: TypedDocumentNode<
  DeleteHintLevelMutation,
  DeleteHintLevelMutationVariables
> = gql`
  mutation DeleteHintLevelMutation($id: String!) {
    deleteHintLevel(id: $id) {
      id
    }
  }
`

const HintLevelsList = ({ hintLevels }: FindHintLevels) => {
  const [deleteHintLevel] = useMutation(DELETE_HINT_LEVEL_MUTATION, {
    onCompleted: () => {
      toast.success('HintLevel deleted')
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

  const onDeleteClick = (id: DeleteHintLevelMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete hintLevel ' + id + '?')) {
      deleteHintLevel({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Type</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {hintLevels.map((hintLevel) => (
            <tr key={hintLevel.id}>
              <td>{truncate(hintLevel.id)}</td>
              <td>{truncate(hintLevel.type)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.hintLevel({ id: hintLevel.id })}
                    title={'Show hintLevel ' + hintLevel.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editHintLevel({ id: hintLevel.id })}
                    title={'Edit hintLevel ' + hintLevel.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete hintLevel ' + hintLevel.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(hintLevel.id)}
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

export default HintLevelsList
