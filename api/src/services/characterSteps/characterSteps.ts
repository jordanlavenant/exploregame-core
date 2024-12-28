import type {
  QueryResolvers,
  MutationResolvers,
  CharacterStepRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const characterSteps: QueryResolvers['characterSteps'] = () => {
  return db.characterStep.findMany()
}

export const characterStep: QueryResolvers['characterStep'] = ({ id }) => {
  return db.characterStep.findUnique({
    where: { id },
  })
}

export const createCharacterStep: MutationResolvers['createCharacterStep'] = ({
  input,
}) => {
  console.log(input)
  return db.characterStep.create({
    data: input,
  })
}

export const updateCharacterStep: MutationResolvers['updateCharacterStep'] = ({
  id,
  input,
}) => {
  return db.characterStep.update({
    data: input,
    where: { id },
  })
}

export const deleteCharacterStep: MutationResolvers['deleteCharacterStep'] = ({
  id,
}) => {
  return db.characterStep.delete({
    where: { id },
  })
}

export const CharacterStep: CharacterStepRelationResolvers = {
  Character: (_obj, { root }) => {
    return db.characterStep.findUnique({ where: { id: root?.id } }).Character()
  },
  Step: (_obj, { root }) => {
    return db.characterStep.findUnique({ where: { id: root?.id } }).Step()
  },
}
