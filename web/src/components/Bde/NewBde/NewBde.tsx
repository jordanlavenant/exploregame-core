import type {
  CreateBdeMutation,
  CreateBdeInput,
  CreateBdeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import BdeForm from 'src/components/Bde/BdeForm'

const CREATE_BDE_MUTATION: TypedDocumentNode<
  CreateBdeMutation,
  CreateBdeMutationVariables
> = gql`
  mutation CreateBdeMutation($input: CreateBdeInput!) {
    createBde(input: $input) {
      id
    }
  }
`

const NewBde = () => {
  const [createBde, { loading, error }] = useMutation(CREATE_BDE_MUTATION, {
    onCompleted: () => {
      toast.success('Bde created')
      navigate(routes.bdes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: CreateBdeInput) => {
    createBde({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Bde</h2>
      </header>
      <div className="rw-segment-main">
        <BdeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewBde
