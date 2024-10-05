import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const statuses: QueryResolvers['statuses'] = () => {
  return db.status.findMany()
}

export const status: QueryResolvers['status'] = ({ id }) => {
  return db.status.findUnique({
    where: { id },
  })
}

export const createStatus: MutationResolvers['createStatus'] = ({ input }) => {
  return db.status.create({
    data: input,
  })
}

export const updateStatus: MutationResolvers['updateStatus'] = ({
  id,
  input,
}) => {
  return db.status.update({
    data: input,
    where: { id },
  })
}

export const deleteStatus: MutationResolvers['deleteStatus'] = ({ id }) => {
  return db.status.delete({
    where: { id },
  })
}
