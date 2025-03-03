import type {
  CreateLocationMutation,
  CreateLocationInput,
  CreateLocationMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from "sonner"

import LocationForm from 'src/components/Location/LocationForm'

const CREATE_LOCATION_MUTATION: TypedDocumentNode<
  CreateLocationMutation,
  CreateLocationMutationVariables
> = gql`
  mutation CreateLocationMutation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      id
    }
  }
`

const NewLocation = () => {
  const [createLocation, { loading, error }] = useMutation(
    CREATE_LOCATION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Location created')
        navigate(routes.locations())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateLocationInput) => {
    createLocation({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Location</h2>
      </header>
      <div className="rw-segment-main">
        <LocationForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewLocation
