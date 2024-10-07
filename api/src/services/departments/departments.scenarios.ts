import type { Prisma, Department } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DepartmentCreateArgs>({
  department: {
    one: { data: { name: 'String', description: 'String' } },
    two: { data: { name: 'String', description: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Department, 'department'>
