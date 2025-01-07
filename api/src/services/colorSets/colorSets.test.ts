import type { ColorSet } from '@prisma/client'

import {
  colorSets,
  colorSet,
  createColorSet,
  updateColorSet,
  deleteColorSet,
} from './colorSets'
import type { StandardScenario } from './colorSets.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('colorSets', () => {
  scenario('returns all colorSets', async (scenario: StandardScenario) => {
    const result = await colorSets()

    expect(result.length).toEqual(Object.keys(scenario.colorSet).length)
  })

  scenario('returns a single colorSet', async (scenario: StandardScenario) => {
    const result = await colorSet({ id: scenario.colorSet.one.id })

    expect(result).toEqual(scenario.colorSet.one)
  })

  scenario('creates a colorSet', async () => {
    const result = await createColorSet({
      input: { primary: 'String', secondary: 'String', tertiary: 'String' },
    })

    expect(result.primary).toEqual('String')
    expect(result.secondary).toEqual('String')
    expect(result.tertiary).toEqual('String')
  })

  scenario('updates a colorSet', async (scenario: StandardScenario) => {
    const original = (await colorSet({
      id: scenario.colorSet.one.id,
    })) as ColorSet
    const result = await updateColorSet({
      id: original.id,
      input: { primary: 'String2' },
    })

    expect(result.primary).toEqual('String2')
  })

  scenario('deletes a colorSet', async (scenario: StandardScenario) => {
    const original = (await deleteColorSet({
      id: scenario.colorSet.one.id,
    })) as ColorSet
    const result = await colorSet({ id: original.id })

    expect(result).toEqual(null)
  })
})
