import type { Prisma, PlayerScript } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerScriptCreateArgs>({
  playerScript: {
    one: {
      data: {
        score: 3857556,
        remainingTime: 9541646,
        Player: {
          create: {
            email: 'String6016619',
            firstName: 'String',
            lastName: 'String',
            hashedPassword: 'String',
            Gender: { create: { gender: 'String' } },
            Department: { create: { name: 'String', description: 'String' } },
          },
        },
        Script: {
          create: {
            name: 'String',
            Department: { create: { name: 'String', description: 'String' } },
          },
        },
        Step: {
          create: {
            name: 'String',
            Location: { create: { name: 'String', description: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        score: 2462689,
        remainingTime: 3106197,
        Player: {
          create: {
            email: 'String8699538',
            firstName: 'String',
            lastName: 'String',
            hashedPassword: 'String',
            Gender: { create: { gender: 'String' } },
            Department: { create: { name: 'String', description: 'String' } },
          },
        },
        Script: {
          create: {
            name: 'String',
            Department: { create: { name: 'String', description: 'String' } },
          },
        },
        Step: {
          create: {
            name: 'String',
            Location: { create: { name: 'String', description: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<PlayerScript, 'playerScript'>
