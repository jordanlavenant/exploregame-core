import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const scenarios: QueryResolvers['scenarios'] = () => {
  return db.scenario.findMany()
}

export const scenario: QueryResolvers['scenario'] = ({ id }) => {
  return db.scenario.findUnique({
    where: { id },
  })
}

export const createScenario: MutationResolvers['createScenario'] = ({
  input,
}) => {
  return db.scenario.create({
    data: input,
  })
}

export const updateScenario: MutationResolvers['updateScenario'] = ({
  id,
  input,
}) => {
  return db.scenario.update({
    data: input,
    where: { id },
  })
}

export const deleteScenario: MutationResolvers['deleteScenario'] = ({ id }) => {
  return db.scenario.delete({
    where: { id },
  })
}
