import type {
  QueryResolvers,
  MutationResolvers,
  StepRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const steps: QueryResolvers['steps'] = () => {
  return db.step.findMany()
}

export const step: QueryResolvers['step'] = ({ id }) => {
  return db.step.findUnique({
    where: { id },
  })
}

export const createStep: MutationResolvers['createStep'] = ({ input }) => {
  return db.step.create({
    data: input,
  })
}

export const updateStep: MutationResolvers['updateStep'] = ({ id, input }) => {
  return db.step.update({
    data: input,
    where: { id },
  })
}

export const deleteStep: MutationResolvers['deleteStep'] = ({ id }) => {
  return db.step.delete({
    where: { id },
  })
}

export const Step: StepRelationResolvers = {
  ScriptStep: (_obj, { root }) => {
    return db.step.findUnique({ where: { id: root?.id } }).ScriptStep()
  },
  Questions: (_obj, { root }) => {
    return db.question.findMany({
      where: { stepId: root?.id },
      orderBy: { order: 'asc' },
    })
  },
  Location: (_obj, { root }) => {
    return db.step.findUnique({ where: { id: root?.id } }).Location()
  },
  PlayerScript: (_obj, { root }) => {
    return db.step.findUnique({ where: { id: root?.id } }).PlayerScript()
  },
  CharacterStep: (_obj, { root }) => {
    return db.step.findUnique({ where: { id: root?.id } }).CharacterStep()
  },
}
