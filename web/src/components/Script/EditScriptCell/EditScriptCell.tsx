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
import { toast } from "sonner"

import ScriptForm from 'src/components/Script/ScriptForm'

export const QUERY: TypedDocumentNode<EditScriptById> = gql`
  query EditScriptById($id: String!) {
    script: script(id: $id) {
      id
      name
      visible
      departmentId
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
      name
      visible
      departmentId
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
    <ScriptForm
      script={script}
      onSave={onSave}
      error={error}
      loading={loading}
    />
  )
}
