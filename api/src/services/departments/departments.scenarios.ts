import type { Prisma, Department } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DepartmentCreateArgs>({
  department: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 8552374.187644223,
        longitude: 1798251.3051607318,
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
        latitude: 6404366.982432592,
        longitude: 8461597.333407154,
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
