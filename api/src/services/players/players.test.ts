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
        username: 'String4726730',
        hashedPassword: 'String',
        departmentId: scenario.player.two.departmentId,
      },
    })

    expect(result.username).toEqual('String4726730')
    expect(result.hashedPassword).toEqual('String')
    expect(result.departmentId).toEqual(scenario.player.two.departmentId)
  })

  scenario('updates a player', async (scenario: StandardScenario) => {
    const original = (await player({ id: scenario.player.one.id })) as Player
    const result = await updatePlayer({
      id: original.id,
      input: { username: 'String54886982' },
    })

    expect(result.username).toEqual('String54886982')
  })

  scenario('deletes a player', async (scenario: StandardScenario) => {
    const original = (await deletePlayer({
      id: scenario.player.one.id,
    })) as Player
    const result = await player({ id: original.id })

    expect(result).toEqual(null)
  })
})
