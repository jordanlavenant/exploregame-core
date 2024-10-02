import type { Filiere } from '@prisma/client'

import {
  filieres,
  filiere,
  createFiliere,
  updateFiliere,
  deleteFiliere,
} from './filieres'
import type { StandardScenario } from './filieres.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('filieres', () => {
  scenario('returns all filieres', async (scenario: StandardScenario) => {
    const result = await filieres()

    expect(result.length).toEqual(Object.keys(scenario.filiere).length)
  })

  scenario('returns a single filiere', async (scenario: StandardScenario) => {
    const result = await filiere({ idF: scenario.filiere.one.idF })

    expect(result).toEqual(scenario.filiere.one)
  })

  scenario('creates a filiere', async () => {
    const result = await createFiliere({
      input: { nomF: 'String', descriptionF: 'String' },
    })

    expect(result.nomF).toEqual('String')
    expect(result.descriptionF).toEqual('String')
  })

  scenario('updates a filiere', async (scenario: StandardScenario) => {
    const original = (await filiere({
      idF: scenario.filiere.one.idF,
    })) as Filiere
    const result = await updateFiliere({
      idF: original.idF,
      input: { nomF: 'String2' },
    })

    expect(result.nomF).toEqual('String2')
  })

  scenario('deletes a filiere', async (scenario: StandardScenario) => {
    const original = (await deleteFiliere({
      idF: scenario.filiere.one.idF,
    })) as Filiere
    const result = await filiere({ idF: original.idF })

    expect(result).toEqual(null)
  })
})
