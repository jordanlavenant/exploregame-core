import type {
  QueryResolvers,
  MutationResolvers,
  ColorSetRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const colorSets: QueryResolvers['colorSets'] = () => {
  return db.colorSet.findMany()
}

export const colorSet: QueryResolvers['colorSet'] = ({ id }) => {
  return db.colorSet.findUnique({
    where: { id },
  })
}

export const createColorSet: MutationResolvers['createColorSet'] = ({
  input,
}) => {
  return db.colorSet.create({
    data: input,
  })
}

export const updateColorSet: MutationResolvers['updateColorSet'] = ({
  id,
  input,
}) => {
  return db.colorSet.update({
    data: input,
    where: { id },
  })
}

export const deleteColorSet: MutationResolvers['deleteColorSet'] = ({ id }) => {
  return db.colorSet.delete({
    where: { id },
  })
}

export const ColorSet: ColorSetRelationResolvers = {
  Department: (_obj, { root }) => {
    return db.colorSet.findUnique({ where: { id: root?.id } }).Department()
  },
}
