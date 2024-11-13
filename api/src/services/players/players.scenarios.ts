import type { Prisma, Player } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerCreateArgs>({
  player: {
    one: {
      data: {
        email: 'String4232529',
        firstName: 'String',
        lastName: 'String',
        hashedPassword: 'String',
        Gender: { create: { gender: 'String' } },
        Department: { create: { name: 'String', description: 'String' } },
      },
    },
    two: {
      data: {
        email: 'String3162010',
        firstName: 'String',
        lastName: 'String',
        hashedPassword: 'String',
        Gender: { create: { gender: 'String' } },
        Department: { create: { name: 'String', description: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Player, 'player'>
