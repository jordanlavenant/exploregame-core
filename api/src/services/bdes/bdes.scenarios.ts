import type { Prisma, Bde } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BdeCreateArgs>({
  bde: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        logo: 'String',
        Department: {
          create: {
            name: 'String',
            description: 'String',
            latitude: 4737999.126142824,
            longitude: 3238855.119471702,
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
        name: 'String',
        description: 'String',
        logo: 'String',
        Department: {
          create: {
            name: 'String',
            description: 'String',
            latitude: 3251240.3782912605,
            longitude: 1910253.294491644,
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

export type StandardScenario = ScenarioData<Bde, 'bde'>
