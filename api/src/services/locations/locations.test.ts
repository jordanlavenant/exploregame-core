import type { Location } from '@prisma/client'

import {
  locations,
  location,
  createLocation,
  updateLocation,
  deleteLocation,
} from './locations'
import type { StandardScenario } from './locations.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('locations', () => {
  scenario('returns all locations', async (scenario: StandardScenario) => {
    const result = await locations()

    expect(result.length).toEqual(Object.keys(scenario.location).length)
  })

  scenario('returns a single location', async (scenario: StandardScenario) => {
    const result = await location({ id: scenario.location.one.id })

    expect(result).toEqual(scenario.location.one)
  })

  scenario('creates a location', async () => {
    const result = await createLocation({
      input: { name: 'String', description: 'String' },
    })

    expect(result.name).toEqual('String')
    expect(result.description).toEqual('String')
  })

  scenario('updates a location', async (scenario: StandardScenario) => {
    const original = (await location({
      id: scenario.location.one.id,
    })) as Location
    const result = await updateLocation({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a location', async (scenario: StandardScenario) => {
    const original = (await deleteLocation({
      id: scenario.location.one.id,
    })) as Location
    const result = await location({ id: original.id })

    expect(result).toEqual(null)
  })
})
