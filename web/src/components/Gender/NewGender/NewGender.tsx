import type {
  CreateGenderMutation,
  CreateGenderInput,
  CreateGenderMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import GenderForm from 'src/components/Gender/GenderForm'

const CREATE_GENDER_MUTATION: TypedDocumentNode<
  CreateGenderMutation,
  CreateGenderMutationVariables
> = gql`
  mutation CreateGenderMutation($input: CreateGenderInput!) {
    createGender(input: $input) {
      id
    }
  }
`

const NewGender = () => {
  const [createGender, { loading, error }] = useMutation(
    CREATE_GENDER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Gender created')
        navigate(routes.genders())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateGenderInput) => {
    createGender({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Gender</h2>
      </header>
      <div className="rw-segment-main">
        <GenderForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewGender
