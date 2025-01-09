import type {
  QueryResolvers,
  MutationResolvers,
  HintRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const hints: QueryResolvers['hints'] = () => {
  return db.hint.findMany()
}

export const hint: QueryResolvers['hint'] = ({ id }) => {
  return db.hint.findUnique({
    where: { id },
  })
}

export const createHint: MutationResolvers['createHint'] = ({ input }) => {
  return db.hint.create({
    data: input,
  })
}

export const updateHint: MutationResolvers['updateHint'] = ({ id, input }) => {
  return db.hint.update({
    data: input,
    where: { id },
  })
}

export const deleteHint: MutationResolvers['deleteHint'] = ({ id }) => {
  return db.hint.delete({
    where: { id },
  })
}

export const Hint: HintRelationResolvers = {
  HintLevel: (_obj, { root }) => {
    return db.hint.findUnique({ where: { id: root?.id } }).HintLevel()
  },
  Question: (_obj, { root }) => {
    return db.hint.findUnique({ where: { id: root?.id } }).Question()
  },
}
