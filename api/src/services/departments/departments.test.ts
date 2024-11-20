import type { Department } from '@prisma/client'

import {
  departments,
  department,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from './departments'
import type { StandardScenario } from './departments.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('departments', () => {
  scenario('returns all departments', async (scenario: StandardScenario) => {
    const result = await departments()

    expect(result.length).toEqual(Object.keys(scenario.department).length)
  })

  scenario(
    'returns a single department',
    async (scenario: StandardScenario) => {
      const result = await department({ id: scenario.department.one.id })

      expect(result).toEqual(scenario.department.one)
    }
  )

  scenario('creates a department', async (scenario: StandardScenario) => {
    const result = await createDepartment({
      input: {
        name: 'String',
        description: 'String',
        colorSetId: scenario.department.two.colorSetId,
      },
    })

    expect(result.name).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.colorSetId).toEqual(scenario.department.two.colorSetId)
  })

  scenario('updates a department', async (scenario: StandardScenario) => {
    const original = (await department({
      id: scenario.department.one.id,
    })) as Department
    const result = await updateDepartment({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a department', async (scenario: StandardScenario) => {
    const original = (await deleteDepartment({
      id: scenario.department.one.id,
    })) as Department
    const result = await department({ id: original.id })

    expect(result).toEqual(null)
  })
})
