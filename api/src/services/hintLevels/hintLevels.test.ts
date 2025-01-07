import type { HintLevel } from '@prisma/client'

import {
  hintLevels,
  hintLevel,
  createHintLevel,
  updateHintLevel,
  deleteHintLevel,
} from './hintLevels'
import type { StandardScenario } from './hintLevels.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('hintLevels', () => {
  scenario('returns all hintLevels', async (scenario: StandardScenario) => {
    const result = await hintLevels()

    expect(result.length).toEqual(Object.keys(scenario.hintLevel).length)
  })

  scenario('returns a single hintLevel', async (scenario: StandardScenario) => {
    const result = await hintLevel({ id: scenario.hintLevel.one.id })

    expect(result).toEqual(scenario.hintLevel.one)
  })

  scenario('creates a hintLevel', async () => {
    const result = await createHintLevel({
      input: { type: 'String' },
    })

    expect(result.type).toEqual('String')
  })

  scenario('updates a hintLevel', async (scenario: StandardScenario) => {
    const original = (await hintLevel({
      id: scenario.hintLevel.one.id,
    })) as HintLevel
    const result = await updateHintLevel({
      id: original.id,
      input: { type: 'String2' },
    })

    expect(result.type).toEqual('String2')
  })

  scenario('deletes a hintLevel', async (scenario: StandardScenario) => {
    const original = (await deleteHintLevel({
      id: scenario.hintLevel.one.id,
    })) as HintLevel
    const result = await hintLevel({ id: original.id })

    expect(result).toEqual(null)
  })
})
