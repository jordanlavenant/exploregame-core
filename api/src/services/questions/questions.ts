import type {
  QueryResolvers,
  MutationResolvers,
  QuestionRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const questions: QueryResolvers['questions'] = () => {
  return db.question.findMany()
}

export const question: QueryResolvers['question'] = ({ id }) => {
  return db.question.findUnique({
    where: { id },
  })
}

export const createQuestion: MutationResolvers['createQuestion'] = ({
  input,
}) => {
  return db.question.create({
    data: input,
  })
}

export const updateQuestion: MutationResolvers['updateQuestion'] = ({
  id,
  input,
}) => {
  return db.question.update({
    data: input,
    where: { id },
  })
}

export const deleteQuestion: MutationResolvers['deleteQuestion'] = ({ id }) => {
  return db.question.delete({
    where: { id },
  })
}

export const Question: QuestionRelationResolvers = {
  QuestionType: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).QuestionType()
  },
  Location: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).Location()
  },
  Answer: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).Answer()
  },
  Hint: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).Hint()
  },
}
