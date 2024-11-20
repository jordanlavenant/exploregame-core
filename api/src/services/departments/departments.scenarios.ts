import type { Prisma, Department } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DepartmentCreateArgs>({
  department: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        ColorSet: {
          create: {
            primary: 'String',
            secondary: 'String',
            tertiary: 'String',
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        ColorSet: {
          create: {
            primary: 'String',
            secondary: 'String',
            tertiary: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Department, 'department'>
