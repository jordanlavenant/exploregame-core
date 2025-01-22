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

export const checkAnswer: MutationResolvers['checkAnswer'] = async ({ input }) => {
  const question = await db.question.findUnique({
    where: { id: input.questionId },
    include: {
      Answer: true,
    },
  })
  if (!question) {
    throw new Error('Question not found')
  }

  const correctAnswers = question.Answer.filter((answer) => answer.isCorrect).map((answer) => answer.answer)
  const isCorrect = input.answers.every((answer) => correctAnswers.includes(answer)) && input.answers.length === correctAnswers.length

  return {
    isCorrect,
    correctAnswers,
  }
}

export const Question: QuestionRelationResolvers = {
  Step: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).Step()
  },
  QuestionType: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).QuestionType()
  },
  Answer: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).Answer()
  },
  Hint: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).Hint()
  },
  PlayerScript: (_obj, { root }) => {
    return db.question.findUnique({ where: { id: root?.id } }).PlayerScript()
  },
}
