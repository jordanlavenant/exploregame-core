import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        lastname: 'String',
        firstname: 'String',
        mail: 'String',
        password: 'String',
      },
    },
    two: {
      data: {
        lastname: 'String',
        firstname: 'String',
        mail: 'String',
        password: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
