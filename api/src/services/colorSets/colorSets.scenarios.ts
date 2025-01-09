import type { Prisma, ColorSet } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ColorSetCreateArgs>({
  colorSet: {
    one: {
      data: { primary: 'String', secondary: 'String', tertiary: 'String' },
    },
    two: {
      data: { primary: 'String', secondary: 'String', tertiary: 'String' },
    },
  },
})

export type StandardScenario = ScenarioData<ColorSet, 'colorSet'>
