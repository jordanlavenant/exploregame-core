import type {
  CreateFiliereMutation,
  CreateFiliereInput,
  CreateFiliereMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FiliereForm from 'src/components/Filiere/FiliereForm'

const CREATE_FILIERE_MUTATION: TypedDocumentNode<
  CreateFiliereMutation,
  CreateFiliereMutationVariables
> = gql`
  mutation CreateFiliereMutation($input: CreateFiliereInput!) {
    createFiliere(input: $input) {
      idF
    }
  }
`

const NewFiliere = () => {
  const [createFiliere, { loading, error }] = useMutation(
    CREATE_FILIERE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Filiere created')
        navigate(routes.filieres())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateFiliereInput) => {
    createFiliere({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Filiere</h2>
      </header>
      <div className="rw-segment-main">
        <FiliereForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewFiliere
