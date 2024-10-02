import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const filieres: QueryResolvers['filieres'] = () => {
  return db.filiere.findMany()
}

export const filiere: QueryResolvers['filiere'] = ({ idF }) => {
  return db.filiere.findUnique({
    where: { idF },
  })
}

export const createFiliere: MutationResolvers['createFiliere'] = ({
  input,
}) => {
  return db.filiere.create({
    data: input,
  })
}

export const updateFiliere: MutationResolvers['updateFiliere'] = ({
  idF,
  input,
}) => {
  return db.filiere.update({
    data: input,
    where: { idF },
  })
}

export const deleteFiliere: MutationResolvers['deleteFiliere'] = ({ idF }) => {
  return db.filiere.delete({
    where: { idF },
  })
}
