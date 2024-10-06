import type { Prisma, Hint } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.HintCreateArgs>({
  hint: {
    one: {
      data: {
        hint: 'String',
        help: 'String',
        Question: {
          create: {
            question: 'String',
            description: 'String',
            QuestionType: { create: { type: 'String' } },
            Location: { create: { name: 'String', description: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        hint: 'String',
        help: 'String',
        Question: {
          create: {
            question: 'String',
            description: 'String',
            QuestionType: { create: { type: 'String' } },
            Location: { create: { name: 'String', description: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Hint, 'hint'>
