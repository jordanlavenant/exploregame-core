import type { Prisma, Gender } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.GenderCreateArgs>({
  gender: {
    one: { data: { gender: 'String' } },
    two: { data: { gender: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Gender, 'gender'>
