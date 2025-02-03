import type { News } from '@prisma/client'

import { newses, news, createNews, updateNews, deleteNews } from './newses'
import type { StandardScenario } from './newses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('newses', () => {
  scenario('returns all newses', async (scenario: StandardScenario) => {
    const result = await newses()

    expect(result.length).toEqual(Object.keys(scenario.news).length)
  })

  scenario('returns a single news', async (scenario: StandardScenario) => {
    const result = await news({ id: scenario.news.one.id })

    expect(result).toEqual(scenario.news.one)
  })

  scenario('creates a news', async () => {
    const result = await createNews({
      input: {
        title: 'String',
        description: 'String',
        date: '2025-02-03T22:31:38.976Z',
      },
    })

    expect(result.title).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.date).toEqual(new Date('2025-02-03T22:31:38.976Z'))
  })

  scenario('updates a news', async (scenario: StandardScenario) => {
    const original = (await news({ id: scenario.news.one.id })) as News
    const result = await updateNews({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a news', async (scenario: StandardScenario) => {
    const original = (await deleteNews({ id: scenario.news.one.id })) as News
    const result = await news({ id: original.id })

    expect(result).toEqual(null)
  })
})
