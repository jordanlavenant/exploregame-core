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
        answer: 'String',
        description: 'String',
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

export type StandardScenario = ScenarioData<Answer, 'answer'>
