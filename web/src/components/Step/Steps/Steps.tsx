import type {
  DeleteStepMutation,
  DeleteStepMutationVariables,
  FindSteps,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import { QUERY } from 'src/components/Step/StepsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_STEP_MUTATION: TypedDocumentNode<
  DeleteStepMutation,
  DeleteStepMutationVariables
> = gql`
  mutation DeleteStepMutation($id: String!) {
    deleteStep(id: $id) {
      id
    }
  }
`

const StepsList = ({ steps }: FindSteps) => {
  const [deleteStep] = useMutation(DELETE_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('Step deleted')
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

  const onDeleteClick = (id: DeleteStepMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete step ' + id + '?')) {
      deleteStep({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Location id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr key={step.id}>
              <td>{truncate(step.id)}</td>
              <td>{truncate(step.name)}</td>
              <td>{truncate(step.locationId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.step({ id: step.id })}
                    title={'Show step ' + step.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editStep({ id: step.id })}
                    title={'Edit step ' + step.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete step ' + step.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(step.id)}
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

export default StepsList
