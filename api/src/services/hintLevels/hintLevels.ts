import type {
  QueryResolvers,
  MutationResolvers,
  HintLevelRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const hintLevels: QueryResolvers['hintLevels'] = () => {
  return db.hintLevel.findMany()
}

export const hintLevel: QueryResolvers['hintLevel'] = ({ id }) => {
  return db.hintLevel.findUnique({
    where: { id },
  })
}

export const createHintLevel: MutationResolvers['createHintLevel'] = ({
  input,
}) => {
  return db.hintLevel.create({
    data: input,
  })
}

export const updateHintLevel: MutationResolvers['updateHintLevel'] = ({
  id,
  input,
}) => {
  return db.hintLevel.update({
    data: input,
    where: { id },
  })
}

export const deleteHintLevel: MutationResolvers['deleteHintLevel'] = ({
  id,
}) => {
  return db.hintLevel.delete({
    where: { id },
  })
}

export const HintLevel: HintLevelRelationResolvers = {
  Hint: (_obj, { root }) => {
    return db.hintLevel.findUnique({ where: { id: root?.id } }).Hint()
  },
}
