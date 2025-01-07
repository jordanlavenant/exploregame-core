import type { Gender } from '@prisma/client'

import {
  genders,
  gender,
  createGender,
  updateGender,
  deleteGender,
} from './genders'
import type { StandardScenario } from './genders.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('genders', () => {
  scenario('returns all genders', async (scenario: StandardScenario) => {
    const result = await genders()

    expect(result.length).toEqual(Object.keys(scenario.gender).length)
  })

  scenario('returns a single gender', async (scenario: StandardScenario) => {
    const result = await gender({ id: scenario.gender.one.id })

    expect(result).toEqual(scenario.gender.one)
  })

  scenario('creates a gender', async () => {
    const result = await createGender({
      input: { gender: 'String' },
    })

    expect(result.gender).toEqual('String')
  })

  scenario('updates a gender', async (scenario: StandardScenario) => {
    const original = (await gender({ id: scenario.gender.one.id })) as Gender
    const result = await updateGender({
      id: original.id,
      input: { gender: 'String2' },
    })

    expect(result.gender).toEqual('String2')
  })

  scenario('deletes a gender', async (scenario: StandardScenario) => {
    const original = (await deleteGender({
      id: scenario.gender.one.id,
    })) as Gender
    const result = await gender({ id: original.id })

    expect(result).toEqual(null)
  })
})
