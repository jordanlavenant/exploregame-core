import type { Prisma, PlayerScript } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerScriptCreateArgs>({
  playerScript: {
    one: {
      data: {
        score: 7278934,
        remainingTime: 6291749,
        Player: {
          create: {
            email: 'String9597003',
            firstName: 'String',
            lastName: 'String',
            hashedPassword: 'String',
            Gender: { create: { gender: 'String' } },
            Department: {
              create: {
                name: 'String',
                description: 'String',
                latitude: 5871443.959538194,
                longitude: 9440288.22151149,
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
                latitude: 2953128.150397708,
                longitude: 2581350.84783274,
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
        score: 3888966,
        remainingTime: 3088175,
        Player: {
          create: {
            email: 'String5784312',
            firstName: 'String',
            lastName: 'String',
            hashedPassword: 'String',
            Gender: { create: { gender: 'String' } },
            Department: {
              create: {
                name: 'String',
                description: 'String',
                latitude: 5958530.841138434,
                longitude: 3924809.527139408,
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
                latitude: 936330.8376612745,
                longitude: 8335385.426969599,
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
