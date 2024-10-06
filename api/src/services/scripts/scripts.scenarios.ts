import type { Prisma, Script } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ScriptCreateArgs>({
  script: {
    one: { data: { script: 'String', description: 'String', word: 'String' } },
    two: { data: { script: 'String', description: 'String', word: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Script, 'script'>
