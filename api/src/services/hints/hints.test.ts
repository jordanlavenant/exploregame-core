import type { Hint } from '@prisma/client'

import { hints, hint, createHint, updateHint, deleteHint } from './hints'
import type { StandardScenario } from './hints.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('hints', () => {
  scenario('returns all hints', async (scenario: StandardScenario) => {
    const result = await hints()

    expect(result.length).toEqual(Object.keys(scenario.hint).length)
  })

  scenario('returns a single hint', async (scenario: StandardScenario) => {
    const result = await hint({ id: scenario.hint.one.id })

    expect(result).toEqual(scenario.hint.one)
  })

  scenario('creates a hint', async (scenario: StandardScenario) => {
    const result = await createHint({
      input: {
        help: 'String',
        questionId: scenario.hint.two.questionId,
        hintLevelId: scenario.hint.two.hintLevelId,
      },
    })

    expect(result.help).toEqual('String')
    expect(result.questionId).toEqual(scenario.hint.two.questionId)
    expect(result.hintLevelId).toEqual(scenario.hint.two.hintLevelId)
  })

  scenario('updates a hint', async (scenario: StandardScenario) => {
    const original = (await hint({ id: scenario.hint.one.id })) as Hint
    const result = await updateHint({
      id: original.id,
      input: { help: 'String2' },
    })

    expect(result.help).toEqual('String2')
  })

  scenario('deletes a hint', async (scenario: StandardScenario) => {
    const original = (await deleteHint({ id: scenario.hint.one.id })) as Hint
    const result = await hint({ id: original.id })

    expect(result).toEqual(null)
  })
})
