import type { Prisma, Player } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerCreateArgs>({
  player: {
    one: {
      data: {
        gender: 'String',
        User: {
          create: {
            email: 'String4948749',
            hashedPassword: 'String',
            salt: 'String',
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
            email: 'String8437219',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
        Course: { create: { name: 'String', description: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Player, 'player'>
