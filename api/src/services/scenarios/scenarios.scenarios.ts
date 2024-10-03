import type { Prisma, Scenario } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ScenarioCreateArgs>({
  scenario: {
    one: {
      data: { scenario: 'String', description: 'String', word: 'String' },
    },
    two: {
      data: { scenario: 'String', description: 'String', word: 'String' },
    },
  },
})

export type StandardScenario = ScenarioData<Scenario, 'scenario'>
