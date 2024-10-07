import type { Prisma, ScriptStep } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ScriptStepCreateArgs>({
  scriptStep: {
    one: {
      data: {
        lettre: 'String',
        Script: {
          create: {
            name: 'String',
            Department: { create: { name: 'String', description: 'String' } },
          },
        },
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
        lettre: 'String',
        Script: {
          create: {
            name: 'String',
            Department: { create: { name: 'String', description: 'String' } },
          },
        },
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

export type StandardScenario = ScenarioData<ScriptStep, 'scriptStep'>
