import type { Prisma, Answer } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AnswerCreateArgs>({
  answer: {
    one: {
      data: {
        answer: 'String',
        description: 'String',
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
        answer: 'String',
        description: 'String',
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

export type StandardScenario = ScenarioData<Answer, 'answer'>
