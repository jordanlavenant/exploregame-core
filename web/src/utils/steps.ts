import { UpdateStepInput } from 'types/graphql'

export const saveStep = async ({
  name,
  locationId,
  createStep,
}: {
  name: string
  locationId: string
  createStep: (variables: {
    variables: { input: { name: string; locationId: string } }
  }) => Promise<{ data: { createStep: { id: string } } }>
}) => {
  const response = await createStep({
    variables: {
      input: {
        name,
        locationId,
      },
    },
  })
  return response.data.createStep.id
}

export const changeStep = async ({
  previous,
  name,
  locationId,
  updateStep,
}: {
  previous: {
    id: string
    name: string
    locationId: string
  }
  name: string
  locationId: string
  updateStep: (variables: {
    variables: { id: string; input: UpdateStepInput }
  }) => Promise<{ data: { updateStep: { id: string } } }>
}) => {
  if (previous.name === name && previous.locationId === locationId) return

  const response = await updateStep({
    variables: {
      id: previous.id,
      input: {
        name: name,
        locationId: locationId,
      },
    },
  })
  return response.data.updateStep.id
}
