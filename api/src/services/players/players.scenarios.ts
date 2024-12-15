import type { Prisma, Player } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerCreateArgs>({
  player: {
    one: {
      data: {
        email: 'String3929700',
        firstName: 'String',
        lastName: 'String',
        hashedPassword: 'String',
        Gender: { create: { gender: 'String' } },
        Department: {
          create: {
            name: 'String',
            description: 'String',
            ColorSet: {
              create: {
                primary: 'String',
                secondary: 'String',
                tertiary: 'String',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        email: 'String3324966',
        firstName: 'String',
        lastName: 'String',
        hashedPassword: 'String',
        Gender: { create: { gender: 'String' } },
        Department: {
          create: {
            name: 'String',
            description: 'String',
            ColorSet: {
              create: {
                primary: 'String',
                secondary: 'String',
                tertiary: 'String',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Player, 'player'>
