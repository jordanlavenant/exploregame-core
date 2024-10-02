import type { Prisma, Filiere } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.FiliereCreateArgs>({
  filiere: {
    one: { data: { nomF: 'String', descriptionF: 'String' } },
    two: { data: { nomF: 'String', descriptionF: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Filiere, 'filiere'>
