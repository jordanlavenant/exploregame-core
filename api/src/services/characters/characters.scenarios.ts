import type { Prisma, Character } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CharacterCreateArgs>({
  character: {
    one: { data: { nomPerso: 'String' } },
    two: { data: { nomPerso: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Character, 'character'>
