import type { Question } from '@prisma/client'

import {
  questions,
  question,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from './questions'
import type { StandardScenario } from './questions.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('questions', () => {
  scenario('returns all questions', async (scenario: StandardScenario) => {
    const result = await questions()

    expect(result.length).toEqual(Object.keys(scenario.question).length)
  })

  scenario('returns a single question', async (scenario: StandardScenario) => {
    const result = await question({ id: scenario.question.one.id })

    expect(result).toEqual(scenario.question.one)
  })

  scenario('creates a question', async (scenario: StandardScenario) => {
    const result = await createQuestion({
      input: {
        question: 'String',
        description: 'String',
        questionTypeId: scenario.question.two.questionTypeId,
        stepId: scenario.question.two.stepId,
        order: 1632975,
      },
    })

    expect(result.question).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.questionTypeId).toEqual(scenario.question.two.questionTypeId)
    expect(result.stepId).toEqual(scenario.question.two.stepId)
    expect(result.order).toEqual(1632975)
  })

  scenario('updates a question', async (scenario: StandardScenario) => {
    const original = (await question({
      id: scenario.question.one.id,
    })) as Question
    const result = await updateQuestion({
      id: original.id,
      input: { question: 'String2' },
    })

    expect(result.question).toEqual('String2')
  })

  scenario('deletes a question', async (scenario: StandardScenario) => {
    const original = (await deleteQuestion({
      id: scenario.question.one.id,
    })) as Question
    const result = await question({ id: original.id })

    expect(result).toEqual(null)
  })
})
