import type { Prisma, PlayerScript } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PlayerScriptCreateArgs>({
  playerScript: {
    one: {
      data: {
        score: 5900302,
        remainingTime: 4376580,
        Player: {
          create: {
            email: 'String6250253',
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
        score: 3643905,
        remainingTime: 5309614,
        Player: {
          create: {
            email: 'String2921460',
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
