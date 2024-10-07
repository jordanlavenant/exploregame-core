import type { Prisma, Location } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LocationCreateArgs>({
  location: {
    one: { data: { name: 'String', description: 'String' } },
    two: { data: { name: 'String', description: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Location, 'location'>
