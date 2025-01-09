import type { Prisma, Department } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DepartmentCreateArgs>({
  department: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 253211.82813965448,
        longitude: 1196851.9322168003,
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
        latitude: 3680050.958459815,
        longitude: 5034622.008307504,
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
