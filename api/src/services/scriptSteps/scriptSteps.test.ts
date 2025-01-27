import type { ScriptStep } from '@prisma/client'

import {
  scriptSteps,
  scriptStep,
  createScriptStep,
  updateScriptStep,
  deleteScriptStep,
} from './scriptSteps'
import type { StandardScenario } from './scriptSteps.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('scriptSteps', () => {
  scenario('returns all scriptSteps', async (scenario: StandardScenario) => {
    const result = await scriptSteps()

    expect(result.length).toEqual(Object.keys(scenario.scriptStep).length)
  })

  scenario(
    'returns a single scriptStep',
    async (scenario: StandardScenario) => {
      const result = await scriptStep({ id: scenario.scriptStep.one.id })

      expect(result).toEqual(scenario.scriptStep.one)
    }
  )

  scenario('creates a scriptStep', async (scenario: StandardScenario) => {
    const result = await createScriptStep({
      input: {
        scriptId: scenario.scriptStep.two.scriptId,
        stepId: scenario.scriptStep.two.stepId,
        lettre: 'String',
        order: 5746808,
      },
    })

    expect(result.scriptId).toEqual(scenario.scriptStep.two.scriptId)
    expect(result.stepId).toEqual(scenario.scriptStep.two.stepId)
    expect(result.lettre).toEqual('String')
    expect(result.order).toEqual(5746808)
  })

  scenario('updates a scriptStep', async (scenario: StandardScenario) => {
    const original = (await scriptStep({
      id: scenario.scriptStep.one.id,
    })) as ScriptStep
    const result = await updateScriptStep({
      id: original.id,
      input: { lettre: 'String2' },
    })

    expect(result.lettre).toEqual('String2')
  })

  scenario('deletes a scriptStep', async (scenario: StandardScenario) => {
    const original = (await deleteScriptStep({
      id: scenario.scriptStep.one.id,
    })) as ScriptStep
    const result = await scriptStep({ id: original.id })

    expect(result).toEqual(null)
  })
})
