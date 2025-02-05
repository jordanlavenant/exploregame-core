export const saveStep = async ({
  name,
  locationId,
  createStep,
} : {
  name: string,
  locationId: string,
  createStep: (variables: { variables: { input: { name: string, locationId: string } } }) => Promise<{ data: { createStep: { id: string } } }>
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