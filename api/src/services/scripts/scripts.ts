import type {
  QueryResolvers,
  MutationResolvers,
  ScriptRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const scripts: QueryResolvers['scripts'] = () => {
  return db.script.findMany()
}

export const script: QueryResolvers['script'] = ({ id }) => {
  return db.script.findUnique({
    where: { id },
  })
}

export const createScript: MutationResolvers['createScript'] = ({ input }) => {
  return db.script.create({
    data: input,
  })
}

export const updateScript: MutationResolvers['updateScript'] = ({
  id,
  input,
}) => {
  return db.script.update({
    data: input,
    where: { id },
  })
}

export const deleteScript: MutationResolvers['deleteScript'] = ({ id }) => {
  return db.script.delete({
    where: { id },
  })
}

export const Script: ScriptRelationResolvers = {
  Department: (_obj, { root }) => {
    return db.script.findUnique({ where: { id: root?.id } }).Department()
  },
  ScriptStep: (_obj, { root }) => {
    return db.script.findUnique({ where: { id: root?.id } }).ScriptStep()
  },
  PlayerScript: (_obj, { root }) => {
    return db.script.findUnique({ where: { id: root?.id } }).PlayerScript()
  },
}
