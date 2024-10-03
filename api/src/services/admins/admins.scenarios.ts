import type { Prisma, Admin } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AdminCreateArgs>({
  admin: {
    one: {
      data: {
        role: 'String',
        User: {
          create: {
            lastname: 'String',
            firstname: 'String',
            mail: 'String',
            password: 'String',
          },
        },
      },
    },
    two: {
      data: {
        role: 'String',
        User: {
          create: {
            lastname: 'String',
            firstname: 'String',
            mail: 'String',
            password: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Admin, 'admin'>
