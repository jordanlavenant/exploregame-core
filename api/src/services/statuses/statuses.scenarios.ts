import type { Prisma, Status } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.StatusCreateArgs>({
  status: {
    one: { data: { status: 'String' } },
    two: { data: { status: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Status, 'status'>
