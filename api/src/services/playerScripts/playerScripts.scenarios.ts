import type { Prisma, PlayerScript } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerScriptCreateArgs>({
  playerScript: {
    one: {
      data: {
        score: 3787358,
        remainingTime: 9494707,
        Player: {
          create: {
            email: 'String6327265',
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
        Script: {
          create: {
            name: 'String',
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
        Step: {
          create: {
            name: 'String',
            Location: { create: { name: 'String', description: 'String' } },
          },
        },
        Question: {
          create: {
            question: 'String',
            description: 'String',
            Step: {
              create: {
                name: 'String',
                Location: { create: { name: 'String', description: 'String' } },
              },
            },
            QuestionType: { create: { type: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        score: 7955319,
        remainingTime: 3454462,
        Player: {
          create: {
            email: 'String3268695',
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
        Script: {
          create: {
            name: 'String',
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
        Step: {
          create: {
            name: 'String',
            Location: { create: { name: 'String', description: 'String' } },
          },
        },
        Question: {
          create: {
            question: 'String',
            description: 'String',
            Step: {
              create: {
                name: 'String',
                Location: { create: { name: 'String', description: 'String' } },
              },
            },
            QuestionType: { create: { type: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<PlayerScript, 'playerScript'>
