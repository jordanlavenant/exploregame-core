import type {
  QueryResolvers,
  MutationResolvers,
  AdminRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const admins: QueryResolvers['admins'] = () => {
  return db.admin.findMany()
}

export const admin: QueryResolvers['admin'] = ({ id }) => {
  return db.admin.findUnique({
    where: { id },
  })
}

export const createAdmin: MutationResolvers['createAdmin'] = ({ input }) => {
  return db.admin.create({
    data: input,
  })
}

export const updateAdmin: MutationResolvers['updateAdmin'] = ({
  id,
  input,
}) => {
  return db.admin.update({
    data: input,
    where: { id },
  })
}

export const deleteAdmin: MutationResolvers['deleteAdmin'] = ({ id }) => {
  return db.admin.delete({
    where: { id },
  })
}

export const Admin: AdminRelationResolvers = {
  User: (_obj, { root }) => {
    return db.admin.findUnique({ where: { id: root?.id } }).User()
  },
}
