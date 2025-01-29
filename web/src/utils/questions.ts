import { Question, UpdateQuestionInput } from 'types/graphql'

export const saveQuestions = async ({
  currQuestions,
  updateQuestion,
}: {
  currQuestions: Partial<Question>[]
  updateQuestion: (variables: {
    variables: { id: string; input: UpdateQuestionInput }
  }) => Promise<void>
}) => {
  if (!currQuestions || currQuestions.length === 0) {
    return
  }

  console.table(currQuestions)

  for (const question of currQuestions) {
    updateQuestion({
      variables: {
        id: question.id,
        input: {
          order: question.order,
        },
      },
    })
  }
}
