import type { Answer } from '@prisma/client'

import {
  answers,
  answer,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from './answers'
import type { StandardScenario } from './answers.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('answers', () => {
  scenario('returns all answers', async (scenario: StandardScenario) => {
    const result = await answers()

    expect(result.length).toEqual(Object.keys(scenario.answer).length)
  })

  scenario('returns a single answer', async (scenario: StandardScenario) => {
    const result = await answer({ id: scenario.answer.one.id })

    expect(result).toEqual(scenario.answer.one)
  })

  scenario('creates a answer', async (scenario: StandardScenario) => {
    const result = await createAnswer({
      input: {
        answer: 'String',
        description: 'String',
        questionId: scenario.answer.two.questionId,
      },
    })

    expect(result.answer).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.questionId).toEqual(scenario.answer.two.questionId)
  })

  scenario('updates a answer', async (scenario: StandardScenario) => {
    const original = (await answer({ id: scenario.answer.one.id })) as Answer
    const result = await updateAnswer({
      id: original.id,
      input: { answer: 'String2' },
    })

    expect(result.answer).toEqual('String2')
  })

  scenario('deletes a answer', async (scenario: StandardScenario) => {
    const original = (await deleteAnswer({
      id: scenario.answer.one.id,
    })) as Answer
    const result = await answer({ id: original.id })

    expect(result).toEqual(null)
  })
})
