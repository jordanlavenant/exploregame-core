import type { PlayerScript } from '@prisma/client'

import {
  playerScripts,
  playerScript,
  createPlayerScript,
  updatePlayerScript,
  deletePlayerScript,
} from './playerScripts'
import type { StandardScenario } from './playerScripts.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('playerScripts', () => {
  scenario('returns all playerScripts', async (scenario: StandardScenario) => {
    const result = await playerScripts()

    expect(result.length).toEqual(Object.keys(scenario.playerScript).length)
  })

  scenario(
    'returns a single playerScript',
    async (scenario: StandardScenario) => {
      const result = await playerScript({ id: scenario.playerScript.one.id })

      expect(result).toEqual(scenario.playerScript.one)
    }
  )

  scenario('creates a playerScript', async (scenario: StandardScenario) => {
    const result = await createPlayerScript({
      input: {
        playerId: scenario.playerScript.two.playerId,
        scriptId: scenario.playerScript.two.scriptId,
        stepId: scenario.playerScript.two.stepId,
        score: 7551459,
        remainingTime: 9083039,
      },
    })

    expect(result.playerId).toEqual(scenario.playerScript.two.playerId)
    expect(result.scriptId).toEqual(scenario.playerScript.two.scriptId)
    expect(result.stepId).toEqual(scenario.playerScript.two.stepId)
    expect(result.score).toEqual(7551459)
    expect(result.remainingTime).toEqual(9083039)
  })

  scenario('updates a playerScript', async (scenario: StandardScenario) => {
    const original = (await playerScript({
      id: scenario.playerScript.one.id,
    })) as PlayerScript
    const result = await updatePlayerScript({
      id: original.id,
      input: { score: 2447786 },
    })

    expect(result.score).toEqual(2447786)
  })

  scenario('deletes a playerScript', async (scenario: StandardScenario) => {
    const original = (await deletePlayerScript({
      id: scenario.playerScript.one.id,
    })) as PlayerScript
    const result = await playerScript({ id: original.id })

    expect(result).toEqual(null)
  })
})
