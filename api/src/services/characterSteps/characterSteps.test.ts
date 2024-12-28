import type { CharacterStep } from '@prisma/client'

import {
  characterSteps,
  characterStep,
  createCharacterStep,
  updateCharacterStep,
  deleteCharacterStep,
} from './characterSteps'
import type { StandardScenario } from './characterSteps.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('characterSteps', () => {
  scenario('returns all characterSteps', async (scenario: StandardScenario) => {
    const result = await characterSteps()

    expect(result.length).toEqual(Object.keys(scenario.characterStep).length)
  })

  scenario(
    'returns a single characterStep',
    async (scenario: StandardScenario) => {
      const result = await characterStep({ id: scenario.characterStep.one.id })

      expect(result).toEqual(scenario.characterStep.one)
    }
  )

  scenario('creates a characterStep', async (scenario: StandardScenario) => {
    const result = await createCharacterStep({
      input: {
        characterId: scenario.characterStep.two.characterId,
        stepId: scenario.characterStep.two.stepId,
        textOrder: 8539999,
      },
    })

    expect(result.characterId).toEqual(scenario.characterStep.two.characterId)
    expect(result.stepId).toEqual(scenario.characterStep.two.stepId)
    expect(result.textOrder).toEqual(8539999)
  })

  scenario('updates a characterStep', async (scenario: StandardScenario) => {
    const original = (await characterStep({
      id: scenario.characterStep.one.id,
    })) as CharacterStep
    const result = await updateCharacterStep({
      id: original.id,
      input: { textOrder: 8132960 },
    })

    expect(result.textOrder).toEqual(8132960)
  })

  scenario('deletes a characterStep', async (scenario: StandardScenario) => {
    const original = (await deleteCharacterStep({
      id: scenario.characterStep.one.id,
    })) as CharacterStep
    const result = await characterStep({ id: original.id })

    expect(result).toEqual(null)
  })
})
