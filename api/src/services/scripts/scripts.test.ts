import type { Script } from '@prisma/client'

import {
  scripts,
  script,
  createScript,
  updateScript,
  deleteScript,
} from './scripts'
import type { StandardScenario } from './scripts.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('scripts', () => {
  scenario('returns all scripts', async (scenario: StandardScenario) => {
    const result = await scripts()

    expect(result.length).toEqual(Object.keys(scenario.script).length)
  })

  scenario('returns a single script', async (scenario: StandardScenario) => {
    const result = await script({ id: scenario.script.one.id })

    expect(result).toEqual(scenario.script.one)
  })

  scenario('creates a script', async () => {
    const result = await createScript({
      input: { script: 'String', description: 'String', word: 'String' },
    })

    expect(result.script).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.word).toEqual('String')
  })

  scenario('updates a script', async (scenario: StandardScenario) => {
    const original = (await script({ id: scenario.script.one.id })) as Script
    const result = await updateScript({
      id: original.id,
      input: { script: 'String2' },
    })

    expect(result.script).toEqual('String2')
  })

  scenario('deletes a script', async (scenario: StandardScenario) => {
    const original = (await deleteScript({
      id: scenario.script.one.id,
    })) as Script
    const result = await script({ id: original.id })

    expect(result).toEqual(null)
  })
})
