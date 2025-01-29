import { Question, UpdateQuestionInput } from "types/graphql"

export const saveQuestions = async (
  {
    currQuestions,
    updateQuestion,
  } : {
    currQuestions: Partial<Question>[]
    updateQuestion: (variables: { variables : { id: string, input: UpdateQuestionInput }}) => void
}) => {
  if (!currQuestions || currQuestions.length === 0) {
    return
  }

  console.log(currQuestions)
}