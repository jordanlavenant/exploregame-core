import type {
  QueryResolvers,
  MutationResolvers,
  BdeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const bdes: QueryResolvers['bdes'] = () => {
  return db.bde.findMany()
}

export const bde: QueryResolvers['bde'] = ({ id }) => {
  return db.bde.findUnique({
    where: { id },
  })
}

export const createBde: MutationResolvers['createBde'] = ({ input }) => {
  return db.bde.create({
    data: input,
  })
}

export const updateBde: MutationResolvers['updateBde'] = ({ id, input }) => {
  return db.bde.update({
    data: input,
    where: { id },
  })
}

export const deleteBde: MutationResolvers['deleteBde'] = ({ id }) => {
  return db.bde.delete({
    where: { id },
  })
}

export const Bde: BdeRelationResolvers = {
  Department: (_obj, { root }) => {
    return db.bde.findUnique({ where: { id: root?.id } }).Department()
  },
}
