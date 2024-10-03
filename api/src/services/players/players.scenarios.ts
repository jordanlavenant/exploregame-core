import type { Prisma, Player } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerCreateArgs>({
  player: {
    one: {
      data: {
        gender: 'String',
        User: {
          create: {
            lastname: 'String',
            firstname: 'String',
            mail: 'String',
            password: 'String',
          },
        },
        Course: { create: { name: 'String', description: 'String' } },
      },
    },
    two: {
      data: {
        gender: 'String',
        User: {
          create: {
            lastname: 'String',
            firstname: 'String',
            mail: 'String',
            password: 'String',
          },
        },
        Course: { create: { name: 'String', description: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Player, 'player'>
