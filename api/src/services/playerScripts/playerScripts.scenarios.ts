import type { Prisma, PlayerScript } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerScriptCreateArgs>({
  playerScript: {
    one: {
      data: {
        score: 2773641,
        remainingTime: 809340,
        Player: {
          create: {
            email: 'String7727288',
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
      },
    },
    two: {
      data: {
        score: 9639761,
        remainingTime: 6526489,
        Player: {
          create: {
            email: 'String7735180',
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
      },
    },
  },
})

export type StandardScenario = ScenarioData<PlayerScript, 'playerScript'>
