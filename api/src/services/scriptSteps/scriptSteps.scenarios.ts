import type { Prisma, ScriptStep } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ScriptStepCreateArgs>({
  scriptStep: {
    one: {
      data: {
        lettre: 'String',
        order: 3939540,
        Script: {
          create: {
            name: 'String',
            Department: {
              create: {
                name: 'String',
                description: 'String',
                latitude: 1022478.3463442511,
                longitude: 9818259.260846065,
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
        lettre: 'String',
        order: 3781293,
        Script: {
          create: {
            name: 'String',
            Department: {
              create: {
                name: 'String',
                description: 'String',
                latitude: 9125595.480434995,
                longitude: 1171259.8507239914,
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

export type StandardScenario = ScenarioData<ScriptStep, 'scriptStep'>
