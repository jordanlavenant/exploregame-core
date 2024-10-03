import type {
  QueryResolvers,
  MutationResolvers,
  AnswerRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const answers: QueryResolvers['answers'] = () => {
  return db.answer.findMany()
}

export const answer: QueryResolvers['answer'] = ({ id }) => {
  return db.answer.findUnique({
    where: { id },
  })
}

export const createAnswer: MutationResolvers['createAnswer'] = ({ input }) => {
  return db.answer.create({
    data: input,
  })
}

export const updateAnswer: MutationResolvers['updateAnswer'] = ({
  id,
  input,
}) => {
  return db.answer.update({
    data: input,
    where: { id },
  })
}

export const deleteAnswer: MutationResolvers['deleteAnswer'] = ({ id }) => {
  return db.answer.delete({
    where: { id },
  })
}

export const Answer: AnswerRelationResolvers = {
  Question: (_obj, { root }) => {
    return db.answer.findUnique({ where: { id: root?.id } }).Question()
  },
}
