import type { Prisma, Script } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ScriptCreateArgs>({
  script: {
    one: {
      data: {
        name: 'String',
        Department: { create: { name: 'String', description: 'String' } },
      },
    },
    two: {
      data: {
        name: 'String',
        Department: { create: { name: 'String', description: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Script, 'script'>
