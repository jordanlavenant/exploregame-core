import type { Prisma, Step } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.StepCreateArgs>({
  step: {
    one: {
      data: {
        name: 'String',
        Location: { create: { name: 'String', description: 'String' } },
      },
    },
    two: {
      data: {
        name: 'String',
        Location: { create: { name: 'String', description: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Step, 'step'>
