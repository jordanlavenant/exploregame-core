import type {
  EditScriptById,
  UpdateScriptInput,
  UpdateScriptMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ScriptForm from 'src/components/Script/ScriptForm'

export const QUERY: TypedDocumentNode<EditScriptById> = gql`
  query EditScriptById($id: String!) {
    script: script(id: $id) {
      id
      script
      description
      word
    }
  }
`

const UPDATE_SCRIPT_MUTATION: TypedDocumentNode<
  EditScriptById,
  UpdateScriptMutationVariables
> = gql`
  mutation UpdateScriptMutation($id: String!, $input: UpdateScriptInput!) {
    updateScript(id: $id, input: $input) {
      id
      script
      description
      word
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ script }: CellSuccessProps<EditScriptById>) => {
  const [updateScript, { loading, error }] = useMutation(
    UPDATE_SCRIPT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Script updated')
        navigate(routes.scripts())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateScriptInput,
    id: EditScriptById['script']['id']
  ) => {
    updateScript({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Script {script?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ScriptForm
          script={script}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
