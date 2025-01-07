import type {
  EditGenderById,
  UpdateGenderInput,
  UpdateGenderMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import GenderForm from 'src/components/Gender/GenderForm'

export const QUERY: TypedDocumentNode<EditGenderById> = gql`
  query EditGenderById($id: String!) {
    gender: gender(id: $id) {
      id
      gender
    }
  }
`

const UPDATE_GENDER_MUTATION: TypedDocumentNode<
  EditGenderById,
  UpdateGenderMutationVariables
> = gql`
  mutation UpdateGenderMutation($id: String!, $input: UpdateGenderInput!) {
    updateGender(id: $id, input: $input) {
      id
      gender
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ gender }: CellSuccessProps<EditGenderById>) => {
  const [updateGender, { loading, error }] = useMutation(
    UPDATE_GENDER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Gender updated')
        navigate(routes.genders())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateGenderInput,
    id: EditGenderById['gender']['id']
  ) => {
    updateGender({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Gender {gender?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <GenderForm
          gender={gender}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
