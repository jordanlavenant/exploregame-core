import type { Prisma, Hint } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.HintCreateArgs>({
  hint: {
    one: {
      data: {
        help: 'String',
        HintLevel: { create: { type: 'String' } },
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
        help: 'String',
        HintLevel: { create: { type: 'String' } },
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

export type StandardScenario = ScenarioData<Hint, 'hint'>
