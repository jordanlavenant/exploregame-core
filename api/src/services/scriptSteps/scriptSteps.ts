import type {
  QueryResolvers,
  MutationResolvers,
  ScriptStepRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const scriptSteps: QueryResolvers['scriptSteps'] = () => {
  return db.scriptStep.findMany()
}

export const scriptStep: QueryResolvers['scriptStep'] = ({ id }) => {
  return db.scriptStep.findUnique({
    where: { id },
  })
}

export const createScriptStep: MutationResolvers['createScriptStep'] = ({
  input,
}) => {
  return db.scriptStep.create({
    data: input,
  })
}

export const updateScriptStep: MutationResolvers['updateScriptStep'] = ({
  id,
  input,
}) => {
  return db.scriptStep.update({
    data: input,
    where: { id },
  })
}

export const deleteScriptStep: MutationResolvers['deleteScriptStep'] = ({
  id,
}) => {
  return db.scriptStep.delete({
    where: { id },
  })
}

export const ScriptStep: ScriptStepRelationResolvers = {
  Script: (_obj, { root }) => {
    return db.scriptStep.findUnique({ where: { id: root?.id } }).Script()
  },
  Step: (_obj, { root }) => {
    return db.scriptStep.findUnique({ where: { id: root?.id } }).Step()
  },
}
