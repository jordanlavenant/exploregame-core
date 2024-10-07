import type { Prisma, Question } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.QuestionCreateArgs>({
  question: {
    one: {
      data: {
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
    two: {
      data: {
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
})

export type StandardScenario = ScenarioData<Question, 'question'>
