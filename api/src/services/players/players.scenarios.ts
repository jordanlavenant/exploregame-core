import type { Prisma, Player } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerCreateArgs>({
  player: {
    one: {
      data: {
        email: 'String7061787',
        firstName: 'String',
        lastName: 'String',
        hashedPassword: 'String',
        salt: 'String',
        Gender: { create: { gender: 'String' } },
        Department: { create: { name: 'String', description: 'String' } },
      },
    },
    two: {
      data: {
        email: 'String2117534',
        firstName: 'String',
        lastName: 'String',
        hashedPassword: 'String',
        salt: 'String',
        Gender: { create: { gender: 'String' } },
        Department: { create: { name: 'String', description: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Player, 'player'>
