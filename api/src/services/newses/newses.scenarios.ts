import type { Prisma, News } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NewsCreateArgs>({
  news: {
    one: {
      data: {
        titre: 'String',
        description: 'String',
        date: '2025-02-01T13:35:45.258Z',
      },
    },
    two: {
      data: {
        titre: 'String',
        description: 'String',
        date: '2025-02-01T13:35:45.258Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<News, 'news'>
