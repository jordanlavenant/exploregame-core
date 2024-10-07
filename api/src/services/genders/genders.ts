import type {
  QueryResolvers,
  MutationResolvers,
  GenderRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const genders: QueryResolvers['genders'] = () => {
  return db.gender.findMany()
}

export const gender: QueryResolvers['gender'] = ({ id }) => {
  return db.gender.findUnique({
    where: { id },
  })
}

export const createGender: MutationResolvers['createGender'] = ({ input }) => {
  return db.gender.create({
    data: input,
  })
}

export const updateGender: MutationResolvers['updateGender'] = ({
  id,
  input,
}) => {
  return db.gender.update({
    data: input,
    where: { id },
  })
}

export const deleteGender: MutationResolvers['deleteGender'] = ({ id }) => {
  return db.gender.delete({
    where: { id },
  })
}

export const Gender: GenderRelationResolvers = {
  Player: (_obj, { root }) => {
    return db.gender.findUnique({ where: { id: root?.id } }).Player()
  },
}
