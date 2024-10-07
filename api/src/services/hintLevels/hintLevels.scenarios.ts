import type { Prisma, HintLevel } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.HintLevelCreateArgs>({
  hintLevel: {
    one: { data: { type: 'String' } },
    two: { data: { type: 'String' } },
  },
})

export type StandardScenario = ScenarioData<HintLevel, 'hintLevel'>
