import type { Tag } from '@prisma/client'

import { tags, tag, createTag, updateTag, deleteTag } from './tags'
import type { StandardScenario } from './tags.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('tags', () => {
  scenario('returns all tags', async (scenario: StandardScenario) => {
    const result = await tags()

    expect(result.length).toEqual(Object.keys(scenario.tag).length)
  })

  scenario('returns a single tag', async (scenario: StandardScenario) => {
    const result = await tag({ id: scenario.tag.one.id })

    expect(result).toEqual(scenario.tag.one)
  })

  scenario('creates a tag', async () => {
    const result = await createTag({
      input: { titre: 'String' },
    })

    expect(result.titre).toEqual('String')
  })

  scenario('updates a tag', async (scenario: StandardScenario) => {
    const original = (await tag({ id: scenario.tag.one.id })) as Tag
    const result = await updateTag({
      id: original.id,
      input: { titre: 'String2' },
    })

    expect(result.titre).toEqual('String2')
  })

  scenario('deletes a tag', async (scenario: StandardScenario) => {
    const original = (await deleteTag({ id: scenario.tag.one.id })) as Tag
    const result = await tag({ id: original.id })

    expect(result).toEqual(null)
  })
})
