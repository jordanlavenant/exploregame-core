import type { Prisma, QuestionType } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.QuestionTypeCreateArgs>({
  questionType: {
    one: { data: { type: 'String' } },
    two: { data: { type: 'String' } },
  },
})

export type StandardScenario = ScenarioData<QuestionType, 'questionType'>
