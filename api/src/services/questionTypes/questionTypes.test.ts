import type { QuestionType } from '@prisma/client'

import {
  questionTypes,
  questionType,
  createQuestionType,
  updateQuestionType,
  deleteQuestionType,
} from './questionTypes'
import type { StandardScenario } from './questionTypes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('questionTypes', () => {
  scenario('returns all questionTypes', async (scenario: StandardScenario) => {
    const result = await questionTypes()

    expect(result.length).toEqual(Object.keys(scenario.questionType).length)
  })

  scenario(
    'returns a single questionType',
    async (scenario: StandardScenario) => {
      const result = await questionType({ id: scenario.questionType.one.id })

      expect(result).toEqual(scenario.questionType.one)
    }
  )

  scenario('creates a questionType', async () => {
    const result = await createQuestionType({
      input: { type: 'String' },
    })

    expect(result.type).toEqual('String')
  })

  scenario('updates a questionType', async (scenario: StandardScenario) => {
    const original = (await questionType({
      id: scenario.questionType.one.id,
    })) as QuestionType
    const result = await updateQuestionType({
      id: original.id,
      input: { type: 'String2' },
    })

    expect(result.type).toEqual('String2')
  })

  scenario('deletes a questionType', async (scenario: StandardScenario) => {
    const original = (await deleteQuestionType({
      id: scenario.questionType.one.id,
    })) as QuestionType
    const result = await questionType({ id: original.id })

    expect(result).toEqual(null)
  })
})
