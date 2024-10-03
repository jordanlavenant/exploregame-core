import type { Scenario } from '@prisma/client'

import {
  scenarios,
  scenario,
  createScenario,
  updateScenario,
  deleteScenario,
} from './scenarios'
import type { StandardScenario } from './scenarios.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('scenarios', () => {
  scenario('returns all scenarios', async (scenario: StandardScenario) => {
    const result = await scenarios()

    expect(result.length).toEqual(Object.keys(scenario.scenario).length)
  })

  scenario('returns a single scenario', async (scenario: StandardScenario) => {
    const result = await scenario({ id: scenario.scenario.one.id })

    expect(result).toEqual(scenario.scenario.one)
  })

  scenario('creates a scenario', async () => {
    const result = await createScenario({
      input: { scenario: 'String', description: 'String', word: 'String' },
    })

    expect(result.scenario).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.word).toEqual('String')
  })

  scenario('updates a scenario', async (scenario: StandardScenario) => {
    const original = (await scenario({
      id: scenario.scenario.one.id,
    })) as Scenario
    const result = await updateScenario({
      id: original.id,
      input: { scenario: 'String2' },
    })

    expect(result.scenario).toEqual('String2')
  })

  scenario('deletes a scenario', async (scenario: StandardScenario) => {
    const original = (await deleteScenario({
      id: scenario.scenario.one.id,
    })) as Scenario
    const result = await scenario({ id: original.id })

    expect(result).toEqual(null)
  })
})
