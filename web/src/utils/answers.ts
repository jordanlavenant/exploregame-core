import { EditQuestionById } from 'types/graphql'

interface SaveAnswersProps {
  currentAnswers:
    | {
        id: string
        answer: string
        description: string
        isCorrect: boolean
      }[]
    | undefined
  question: EditQuestionById['question']
  deleteAnswer: (variables: { variables: { id: string } }) => void
  createAnswer: (variables: {
    variables: {
      input: {
        answer: string
        description: string
        isCorrect: boolean
        questionId: string
      }
    }
  }) => void
}

export const saveAnswers = async ({
  currentAnswers,
  question,
  deleteAnswer,
  createAnswer,
}: SaveAnswersProps) => {
  if (!currentAnswers || currentAnswers.length === 0) {
    return
  }
  const answers = question?.Answer

  const questionId = question?.id

  if (answers) {
    if (answers === currentAnswers) return

    // Delete all answers of the question
    const answersToDelete = answers.filter(
      (answer) => answer.questionId === questionId
    )
    answersToDelete.forEach((answer) => {
      deleteAnswer({
        variables: {
          id: answer.id,
        },
      })
    })
  }

  // Re-create all answers of the question
  currentAnswers.forEach((answer) => {
    createAnswer({
      variables: {
        input: {
          answer: answer.answer,
          description: answer.description,
          isCorrect: answer.isCorrect,
          questionId: questionId,
        },
      },
    })
  })
}
