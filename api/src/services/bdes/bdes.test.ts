import type { Bde } from '@prisma/client'

import { bdes, bde, createBde, updateBde, deleteBde } from './bdes'
import type { StandardScenario } from './bdes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('bdes', () => {
  scenario('returns all bdes', async (scenario: StandardScenario) => {
    const result = await bdes()

    expect(result.length).toEqual(Object.keys(scenario.bde).length)
  })

  scenario('returns a single bde', async (scenario: StandardScenario) => {
    const result = await bde({ id: scenario.bde.one.id })

    expect(result).toEqual(scenario.bde.one)
  })

  scenario('creates a bde', async (scenario: StandardScenario) => {
    const result = await createBde({
      input: {
        name: 'String',
        description: 'String',
        logo: 'String',
        departmentId: scenario.bde.two.departmentId,
      },
    })

    expect(result.name).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.logo).toEqual('String')
    expect(result.departmentId).toEqual(scenario.bde.two.departmentId)
  })

  scenario('updates a bde', async (scenario: StandardScenario) => {
    const original = (await bde({ id: scenario.bde.one.id })) as Bde
    const result = await updateBde({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a bde', async (scenario: StandardScenario) => {
    const original = (await deleteBde({ id: scenario.bde.one.id })) as Bde
    const result = await bde({ id: original.id })

    expect(result).toEqual(null)
  })
})
