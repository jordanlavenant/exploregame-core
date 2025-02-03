import type { Prisma, News } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NewsCreateArgs>({
  news: {
    one: {
      data: {
        title: 'String',
        description: 'String',
        date: '2025-02-03T22:31:39.012Z',
      },
    },
    two: {
      data: {
        title: 'String',
        description: 'String',
        date: '2025-02-03T22:31:39.012Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<News, 'news'>
