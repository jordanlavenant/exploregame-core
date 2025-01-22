import type { Prisma, Player } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerCreateArgs>({
  player: {
    one: {
      data: {
        username: 'String1713743',
        hashedPassword: 'String',
        Department: {
          create: {
            name: 'String',
            description: 'String',
            latitude: 2776741.0850526253,
            longitude: 9832456.867650997,
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
        username: 'String3301227',
        hashedPassword: 'String',
        Department: {
          create: {
            name: 'String',
            description: 'String',
            latitude: 5474484.72516233,
            longitude: 5514217.463926623,
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
