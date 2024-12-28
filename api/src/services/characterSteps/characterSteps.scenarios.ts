import type { Prisma, CharacterStep } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CharacterStepCreateArgs>({
  characterStep: {
    one: {
      data: {
        textOrder: 1678635,
        Character: { create: { nomPerso: 'String' } },
        Step: {
          create: {
            name: 'String',
            Location: { create: { name: 'String', description: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        textOrder: 6850958,
        Character: { create: { nomPerso: 'String' } },
        Step: {
          create: {
            name: 'String',
            Location: { create: { name: 'String', description: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<CharacterStep, 'characterStep'>
