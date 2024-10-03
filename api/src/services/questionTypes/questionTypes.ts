import type {
  QueryResolvers,
  MutationResolvers,
  QuestionTypeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const questionTypes: QueryResolvers['questionTypes'] = () => {
  return db.questionType.findMany()
}

export const questionType: QueryResolvers['questionType'] = ({ id }) => {
  return db.questionType.findUnique({
    where: { id },
  })
}

export const createQuestionType: MutationResolvers['createQuestionType'] = ({
  input,
}) => {
  return db.questionType.create({
    data: input,
  })
}

export const updateQuestionType: MutationResolvers['updateQuestionType'] = ({
  id,
  input,
}) => {
  return db.questionType.update({
    data: input,
    where: { id },
  })
}

export const deleteQuestionType: MutationResolvers['deleteQuestionType'] = ({
  id,
}) => {
  return db.questionType.delete({
    where: { id },
  })
}

export const QuestionType: QuestionTypeRelationResolvers = {
  Question: (_obj, { root }) => {
    return db.questionType.findUnique({ where: { id: root?.id } }).Question()
  },
}
