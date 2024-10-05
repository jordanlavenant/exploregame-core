import type { Status } from '@prisma/client'

import {
  statuses,
  status,
  createStatus,
  updateStatus,
  deleteStatus,
} from './statuses'
import type { StandardScenario } from './statuses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('statuses', () => {
  scenario('returns all statuses', async (scenario: StandardScenario) => {
    const result = await statuses()

    expect(result.length).toEqual(Object.keys(scenario.status).length)
  })

  scenario('returns a single status', async (scenario: StandardScenario) => {
    const result = await status({ id: scenario.status.one.id })

    expect(result).toEqual(scenario.status.one)
  })

  scenario('creates a status', async () => {
    const result = await createStatus({
      input: { status: 'String' },
    })

    expect(result.status).toEqual('String')
  })

  scenario('updates a status', async (scenario: StandardScenario) => {
    const original = (await status({ id: scenario.status.one.id })) as Status
    const result = await updateStatus({
      id: original.id,
      input: { status: 'String2' },
    })

    expect(result.status).toEqual('String2')
  })

  scenario('deletes a status', async (scenario: StandardScenario) => {
    const original = (await deleteStatus({
      id: scenario.status.one.id,
    })) as Status
    const result = await status({ id: original.id })

    expect(result).toEqual(null)
  })
})
