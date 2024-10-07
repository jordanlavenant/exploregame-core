import type { Prisma, PlayerScript } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerScriptCreateArgs>({
  playerScript: {
    one: {
      data: {
        score: 1264330,
        remainingTime: 1821310,
        Player: {
          create: {
            email: 'String5567092',
            firstName: 'String',
            lastName: 'String',
            hashedPassword: 'String',
            Gender: { create: { gender: 'String' } },
            Department: { create: { name: 'String', description: 'String' } },
          },
        },
        Script: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        score: 1548232,
        remainingTime: 2198881,
        Player: {
          create: {
            email: 'String6335476',
            firstName: 'String',
            lastName: 'String',
            hashedPassword: 'String',
            Gender: { create: { gender: 'String' } },
            Department: { create: { name: 'String', description: 'String' } },
          },
        },
        Script: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<PlayerScript, 'playerScript'>
