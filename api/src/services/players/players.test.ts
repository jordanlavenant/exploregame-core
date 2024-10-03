import type { Player } from '@prisma/client'

import {
  players,
  player,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from './players'
import type { StandardScenario } from './players.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('players', () => {
  scenario('returns all players', async (scenario: StandardScenario) => {
    const result = await players()

    expect(result.length).toEqual(Object.keys(scenario.player).length)
  })

  scenario('returns a single player', async (scenario: StandardScenario) => {
    const result = await player({ id: scenario.player.one.id })

    expect(result).toEqual(scenario.player.one)
  })

  scenario('creates a player', async (scenario: StandardScenario) => {
    const result = await createPlayer({
      input: {
        gender: 'String',
        idU: scenario.player.two.idU,
        idF: scenario.player.two.idF,
      },
    })

    expect(result.gender).toEqual('String')
    expect(result.idU).toEqual(scenario.player.two.idU)
    expect(result.idF).toEqual(scenario.player.two.idF)
  })

  scenario('updates a player', async (scenario: StandardScenario) => {
    const original = (await player({ id: scenario.player.one.id })) as Player
    const result = await updatePlayer({
      id: original.id,
      input: { gender: 'String2' },
    })

    expect(result.gender).toEqual('String2')
  })

  scenario('deletes a player', async (scenario: StandardScenario) => {
    const original = (await deletePlayer({
      id: scenario.player.one.id,
    })) as Player
    const result = await player({ id: original.id })

    expect(result).toEqual(null)
  })
})
