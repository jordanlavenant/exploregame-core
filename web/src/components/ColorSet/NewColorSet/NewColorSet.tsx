import type {
  CreateColorSetMutation,
  CreateColorSetInput,
  CreateColorSetMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import ColorSetForm from 'src/components/ColorSet/ColorSetForm'

const CREATE_COLOR_SET_MUTATION: TypedDocumentNode<
  CreateColorSetMutation,
  CreateColorSetMutationVariables
> = gql`
  mutation CreateColorSetMutation($input: CreateColorSetInput!) {
    createColorSet(input: $input) {
      id
    }
  }
`

const NewColorSet = () => {
  const [createColorSet, { loading, error }] = useMutation(
    CREATE_COLOR_SET_MUTATION,
    {
      onCompleted: () => {
        toast.success('ColorSet created')
        navigate(routes.colorSets())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateColorSetInput) => {
    createColorSet({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New ColorSet</h2>
      </header>
      <div className="rw-segment-main">
        <ColorSetForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewColorSet
